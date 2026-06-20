"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Wifi,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  Shield,
} from "lucide-react";
import { clearSession, getCurrentUser, getInitials, CurrentUser } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import { DashboardData, MentalHealthTestApi } from "@/lib/mental-health";
const logoImg = "/logo.svg";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Users, label: "Data Mahasiswa", path: "/admin/students" },
  { icon: ClipboardList, label: "Riwayat Tes", path: "/admin/history" },
  { icon: Wifi, label: "Monitoring IoT", path: "/admin/iot" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationRead, setNotificationRead] = useState(false);
  const [recentTests, setRecentTests] = useState<MentalHealthTestApi[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [jakartaDate, setJakartaDate] = useState("");
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };
  const isActive = (path: string) =>
    pathname === path || (pathname === "/admin" && path === "/admin/dashboard");

  useEffect(() => {
    const syncCurrentUser = () => {
      const user = getCurrentUser();

      if (!user || user.role !== "admin") {
        clearSession();
        router.replace("/login");
        return;
      }

      setCurrentUser(user);
      setCheckingAuth(false);
    };

    syncCurrentUser();
    window.addEventListener("meltalcare-session-updated", syncCurrentUser);

    return () => window.removeEventListener("meltalcare-session-updated", syncCurrentUser);
  }, [router]);

  useEffect(() => {
    apiRequest<{ data: DashboardData }>("/admin/dashboard")
      .then((response) => {
        setRecentTests(response.data.recent_tests);
        setNotificationRead(false);
      })
      .catch(() => setRecentTests([]));
  }, []);

  useEffect(() => {
    const updateDate = () => setJakartaDate(new Intl.DateTimeFormat("id-ID", {
      timeZone: "Asia/Jakarta",
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date()));

    updateDate();
    const timer = window.setInterval(updateDate, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };

    if (notificationOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationOpen]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 z-30 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
        style={{ background: "linear-gradient(180deg, #0F2461 0%, #1A3A8F 40%, #1E6CB5 100%)" }}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <Image src={logoImg} alt="Logo" width={40} height={40} className="w-10 h-10 object-contain bg-white rounded-xl p-1 flex-shrink-0" />
          <div>
            <h1 className="text-white text-sm" style={{ fontWeight: 700, letterSpacing: "0.03em" }}>MELTALCARE</h1>
            <p className="text-blue-300 text-xs" style={{ fontWeight: 400 }}>Admin Panel</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Profile */}
        <div ref={profileMenuRef} className="mx-4 mt-5 relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/15 flex items-center gap-3 hover:bg-white/15 transition-all duration-200"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center text-sm"
              style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)", fontWeight: 700, color: "white" }}
            >
              {getInitials(currentUser?.name)}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-white text-sm truncate" style={{ fontWeight: 600 }}>{currentUser?.name || "Administrator"}</p>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-amber-300" />
                <p className="text-amber-300 text-xs" style={{ fontWeight: 500 }}>Super Admin</p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-blue-200 transition-transform duration-200 ${profileMenuOpen ? 'rotate-90' : ''}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {profileMenuOpen && (
            <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-40">
              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  router.push("/admin/profile");
                }}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                style={{ fontWeight: 500 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Lihat Profil
              </button>
              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  router.push("/admin/settings");
                }}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                style={{ fontWeight: 500 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Pengaturan
              </button>
              <div className="border-t border-gray-200">
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    router.push("/admin/users");
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  style={{ fontWeight: 500 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Kelola Pengguna
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="text-blue-400 text-xs uppercase tracking-widest px-3 mb-3" style={{ fontWeight: 600 }}>Manajemen</p>
          {menuItems.map(({ icon: Icon, label, path }) => {
            const active = isActive(path);
            return (
              <button
                key={path}
                onClick={() => { router.push(path); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                  active
                    ? "bg-white text-blue-900 shadow-md"
                    : "text-blue-100 hover:bg-white/10"
                }`}
                style={{ fontWeight: active ? 600 : 400 }}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-blue-700" : "text-blue-300 group-hover:text-white"}`} />
                <span className="flex-1 text-left">{label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
              </button>
            );
          })}
        </nav>

        {/* System Status */}
        <div className="mx-4 mb-4 p-3 rounded-xl bg-white/10 border border-white/15">
          <p className="text-white text-xs mb-2" style={{ fontWeight: 600 }}>Status Sistem</p>
          <div className="space-y-1.5">
            {[
              { label: "Server", status: "Online", color: "#10B981" },
              { label: "Sensor IoT", status: "8/8 Aktif", color: "#10B981" },
              { label: "Database", status: "Normal", color: "#10B981" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-blue-300 text-xs" style={{ fontWeight: 400 }}>{s.label}</span>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-xs" style={{ color: s.color, fontWeight: 500 }}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200"
            style={{ fontWeight: 500 }}
          >
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center gap-4 shadow-sm sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex-1">
            <h2 className="text-gray-800 text-base" style={{ fontWeight: 600 }}>
              {menuItems.find((m) => isActive(m.path))?.label || "Dashboard"}
            </h2>
            <p className="text-gray-400 text-xs" style={{ fontWeight: 400 }}>
              {jakartaDate || "Memuat tanggal..."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div ref={notificationMenuRef} className="relative">
              <button
                onClick={() => {
                  setNotificationOpen((open) => !open);
                  setNotificationRead(true);
                }}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Buka notifikasi admin"
                aria-expanded={notificationOpen}
              >
                <Bell className="w-5 h-5 text-gray-500" />
                {recentTests.length > 0 && !notificationRead && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                    <h3 className="text-sm font-semibold text-gray-800">Notifikasi Admin</h3>
                    <span className="text-xs text-gray-400">{recentTests.length} terbaru</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {recentTests.length === 0 ? (
                      <p className="px-4 py-6 text-center text-sm text-gray-400">Belum ada notifikasi.</p>
                    ) : recentTests.slice(0, 5).map((test) => (
                      <button
                        key={test.id}
                        onClick={() => {
                          setNotificationOpen(false);
                          router.push("/admin/history");
                        }}
                        className="flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-left transition-colors last:border-0 hover:bg-blue-50"
                      >
                        <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${test.category === "Stres Berat" ? "bg-red-500" : test.category === "Stres Ringan" ? "bg-amber-500" : "bg-emerald-500"}`} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-800">{test.student?.name || test.student?.user?.name || "Mahasiswa"}</p>
                          <p className="mt-0.5 text-xs text-gray-600">{test.category} · Skor {test.score}/{test.max_score}</p>
                          <p className="mt-1 text-xs text-gray-400">
                            {new Date(test.tested_at).toLocaleString("id-ID", {
                              timeZone: "Asia/Jakarta",
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                  {recentTests.length > 0 && (
                    <button
                      onClick={() => {
                        setNotificationOpen(false);
                        router.push("/admin/history");
                      }}
                      className="w-full border-t border-gray-100 px-4 py-3 text-center text-xs font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      Lihat semua riwayat tes
                    </button>
                  )}
                </div>
              )}
            </div>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs"
              style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)", fontWeight: 700, color: "white" }}
            >
              {getInitials(currentUser?.name)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

