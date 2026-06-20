"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Brain,
  ClipboardList,
  Activity,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  Heart,
} from "lucide-react";
import { clearSession, getCurrentUser, getInitials, CurrentUser } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import { MentalHealthTestApi, StressLevel } from "@/lib/mental-health";
const logoImg = "/logo.svg";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/student/dashboard" },
  { icon: Brain, label: "Tes Kesehatan Mental", path: "/student/test" },
  { icon: ClipboardList, label: "Riwayat Tes", path: "/student/history" },
  { icon: Activity, label: "Data Detak Jantung", path: "/student/heartrate" },
];

export function StudentLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationRead, setNotificationRead] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [latestMentalStatus, setLatestMentalStatus] = useState<StressLevel | null>(null);
  const [latestMentalTest, setLatestMentalTest] = useState<MentalHealthTestApi | null>(null);
  const [jakartaTime, setJakartaTime] = useState("");
  const [jakartaDate, setJakartaDate] = useState("");
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };
  const isActive = (path: string) => pathname === path || (pathname === "/student" && path === "/student/dashboard");

  useEffect(() => {
    const syncCurrentUser = () => {
      const user = getCurrentUser();

      if (!user || user.role !== "mahasiswa") {
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
    const studentId = currentUser?.student?.id;
    if (!studentId) return;

    apiRequest<{ data: MentalHealthTestApi[] }>(`/students/${studentId}/mental-health-tests`)
      .then((response) => {
        const latestTest = response.data[0] || null;
        setLatestMentalTest(latestTest);
        setLatestMentalStatus(latestTest?.category || null);
        setNotificationRead(false);
      })
      .catch(() => {
        setLatestMentalTest(null);
        setLatestMentalStatus(null);
      });
  }, [currentUser?.student?.id]);

  useEffect(() => {
    const updateJakartaTime = () => {
      setJakartaTime(new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date()).replace(".", ":"));
      setJakartaDate(new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date()));
    };

    updateJakartaTime();
    const timer = window.setInterval(updateJakartaTime, 60_000);

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
      {/* Mobile overlay */}
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
        style={{ background: "linear-gradient(180deg, #1A3A8F 0%, #1E6CB5 60%, #29ABE2 100%)" }}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <Image src={logoImg} alt="Logo" width={40} height={40} className="w-10 h-10 object-contain bg-white rounded-xl p-1 flex-shrink-0" />
          <div>
            <h1 className="text-white text-sm" style={{ fontWeight: 700, letterSpacing: "0.03em" }}>MELTALCARE</h1>
            <p className="text-blue-200 text-xs" style={{ fontWeight: 400 }}>Monitoring Stres</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile */}
        <div ref={profileMenuRef} className="mx-4 mt-5 relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/15 flex items-center gap-3 hover:bg-white/15 transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm"
              style={{ background: "linear-gradient(135deg, #29ABE2, #4FC3F7)", fontWeight: 700, color: "white" }}>
              {getInitials(currentUser?.name)}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-white text-sm truncate" style={{ fontWeight: 600 }}>{currentUser?.name}</p>
              <p className="text-blue-200 text-xs truncate" style={{ fontWeight: 400 }}>NIM: {currentUser?.student?.nim || "-"}</p>
            </div>
            <ChevronRight className={`w-4 h-4 text-blue-200 transition-transform duration-200 ${profileMenuOpen ? 'rotate-90' : ''}`} />
          </button>

          {/* Profile Dropdown Menu */}
          {profileMenuOpen && (
            <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-40">
              <button
                onClick={() => {
                  setProfileMenuOpen(false);
                  router.push("/student/profile");
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
                  router.push("/student/settings");
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
            </div>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="text-blue-300 text-xs uppercase tracking-widest px-3 mb-3" style={{ fontWeight: 600 }}>Menu Utama</p>
          {menuItems.map(({ icon: Icon, label, path }) => {
            const active = isActive(path);
            return (
              <button
                key={path}
                onClick={() => { router.push(path); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                  active
                    ? "bg-white text-blue-800 shadow-md"
                    : "text-blue-100 hover:bg-white/10"
                }`}
                style={{ fontWeight: active ? 600 : 400 }}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-blue-700" : "text-blue-200 group-hover:text-white"}`} />
                <span className="flex-1 text-left">{label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
              </button>
            );
          })}
        </nav>

        {/* Status Card */}
        <div className="mx-4 mb-4 p-3 rounded-xl bg-white/10 border border-white/15">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-3.5 h-3.5 text-red-300" fill="#FCA5A5" />
            <span className="text-white text-xs" style={{ fontWeight: 600 }}>Status Terkini</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${latestMentalStatus === "Stres Berat" ? "bg-red-400" : latestMentalStatus === "Stres Ringan" ? "bg-amber-400" : latestMentalStatus ? "bg-emerald-400" : "bg-gray-300"}`} />
            <span className="text-white text-xs" style={{ fontWeight: 500 }}>
              {latestMentalStatus || "Belum Ada Tes"}
            </span>
          </div>
          <p className="text-blue-300 text-xs mt-1" style={{ fontWeight: 400 }}>
            BPM: 72 | Hari ini {jakartaTime || "--:--"}
          </p>
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
                aria-label="Buka notifikasi"
                aria-expanded={notificationOpen}
              >
                <Bell className="w-5 h-5 text-gray-500" />
                {latestMentalTest && !notificationRead && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                  <div className="border-b border-gray-100 px-4 py-3">
                    <h3 className="text-sm font-semibold text-gray-800">Notifikasi</h3>
                  </div>
                  {latestMentalTest ? (
                    <button
                      onClick={() => {
                        setNotificationOpen(false);
                        router.push("/student/history");
                      }}
                      className="w-full px-4 py-4 text-left transition-colors hover:bg-blue-50"
                    >
                      <div className="flex items-start gap-3">
                        <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${latestMentalStatus === "Stres Berat" ? "bg-red-500" : latestMentalStatus === "Stres Ringan" ? "bg-amber-500" : "bg-emerald-500"}`} />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">Hasil tes kesehatan mental</p>
                          <p className="mt-1 text-xs text-gray-600">
                            Hasil terbaru: {latestMentalTest.category} dengan skor {latestMentalTest.score}/{latestMentalTest.max_score}.
                          </p>
                          <p className="mt-2 text-xs text-gray-400">
                            {new Date(latestMentalTest.tested_at).toLocaleDateString("id-ID", {
                              timeZone: "Asia/Jakarta",
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </button>
                  ) : (
                    <p className="px-4 py-6 text-center text-sm text-gray-400">Belum ada notifikasi.</p>
                  )}
                </div>
              )}
            </div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs"
              style={{ background: "linear-gradient(135deg, #1E6CB5, #29ABE2)", fontWeight: 700, color: "white" }}>
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

