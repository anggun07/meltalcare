"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Activity, Heart, Brain, Info, UserCheck } from "lucide-react";
const logoImg = "/logo.svg";

export function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"mahasiswa" | "admin">("mahasiswa");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignIn = () => {
    setLoading(true);
    // Mock Google OAuth flow
    setTimeout(() => {
      // Simulate successful Google auth
      const mockGoogleUser = {
        email: "student@gmail.com",
        name: "User Google",
        picture: "https://ui-avatars.com/api/?name=User+Google&background=29ABE2&color=fff",
        googleId: "google_" + Date.now(),
      };

      // Check if user exists in localStorage
      const existingUsers = JSON.parse(localStorage.getItem("meltalcare_users") || "[]");
      const userExists = existingUsers.find((u: any) => u.email === mockGoogleUser.email);

      if (userExists) {
        // User exists, login directly
        localStorage.setItem("meltalcare_current_user", JSON.stringify(userExists));
        router.push("/student/dashboard");
      } else {
        // New user, redirect to complete profile
        localStorage.setItem("meltalcare_temp_google_user", JSON.stringify(mockGoogleUser));
        router.push("/register/complete-profile");
      }
      setLoading(false);
    }, 1500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      // Mock login - save user to localStorage
      const user = {
        email,
        role,
        name: role === "admin" ? "Administrator" : "Ahmad Fauzi",
        nim: role === "admin" ? undefined : "20210001",
      };
      localStorage.setItem("meltalcare_current_user", JSON.stringify(user));

      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/student/dashboard");
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #EEF2FF 100%)" }}>
      {/* Left: Illustration Panel */}
      <div
        className="hidden lg:flex flex-col justify-between flex-1 p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #1A3A8F 0%, #1E6CB5 50%, #29ABE2 100%)" }}
      >
        {/* Background decorative circles */}
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full opacity-10 bg-white" />
        <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full opacity-10 bg-white" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full opacity-5 bg-white" />

        {/* Logo + Brand */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={logoImg} alt="MELTALCARE Logo" width={48} height={48} className="w-12 h-12 object-contain bg-white rounded-xl p-1" />
            <div>
              <h1 className="text-white text-xl" style={{ fontWeight: 700, letterSpacing: "0.05em" }}>MELTALCARE</h1>
              <p className="text-blue-200 text-xs" style={{ fontWeight: 400 }}>Monitoring Indikasi Stres Pelajar</p>
            </div>
          </div>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-200"
            style={{
              color: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.1)",
              fontWeight: 500,
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.2)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)")}
          >
            ← Beranda
          </button>
        </div>

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Animated Heart Rate Illustration */}
          <div className="w-64 h-64 mb-8 relative">
            {/* Heart Rate Monitor SVG */}
            <svg viewBox="0 0 300 200" className="w-full h-auto" fill="none">
              {/* Monitor Screen */}
              <rect x="20" y="20" width="260" height="160" rx="12" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
              {/* Grid lines */}
              {[50,80,110,140,170].map((y, i) => (
                <line key={i} x1="30" y1={y} x2="270" y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
              ))}
              {[70,120,170,220].map((x, i) => (
                <line key={i} x1={x} y1="30" x2={x} y2="170" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
              ))}
              {/* ECG Line */}
              <polyline
                points="30,110 60,110 75,110 82,60 90,155 98,110 110,110 130,110 140,110 148,65 156,150 163,110 175,110 195,110 205,110 213,70 221,148 228,110 240,110 270,110"
                fill="none"
                stroke="#29ABE2"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Blinking dot at end */}
              <circle cx="270" cy="110" r="5" fill="#4FC3F7" opacity="0.9"/>
            </svg>

            {/* Stats Bubbles */}
            <div className="absolute top-4 right-0 bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-300" fill="#FCA5A5" />
                <span className="text-white text-sm" style={{ fontWeight: 600 }}>72 BPM</span>
              </div>
              <p className="text-blue-200 text-xs">Detak Jantung</p>
            </div>
            <div className="absolute bottom-4 left-0 bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-300" />
                <span className="text-white text-sm" style={{ fontWeight: 600 }}>Normal</span>
              </div>
              <p className="text-blue-200 text-xs">Status Stres</p>
            </div>
          </div>

          <h2 className="text-white text-3xl mb-4" style={{ fontWeight: 700, lineHeight: 1.3 }}>
            Pantau Kesehatan Mental<br />Dengan Teknologi IoT
          </h2>
          <p className="text-blue-200 text-base max-w-sm" style={{ fontWeight: 400, lineHeight: 1.7 }}>
            Sistem monitoring berbasis sensor detak jantung dan kuesioner psikologis untuk deteksi dini stres pada pelajar.
          </p>

          {/* Feature Chips */}
          <div className="flex flex-wrap gap-3 mt-6 justify-center">
            {[
              { icon: Activity, label: "IoT Sensor" },
              { icon: Brain, label: "AI Klasifikasi" },
              { icon: Heart, label: "Real-time" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 bg-white/15 rounded-full px-4 py-2 border border-white/20">
                <Icon className="w-4 h-4 text-blue-200" />
                <span className="text-white text-sm" style={{ fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-blue-300 text-sm" style={{ fontWeight: 400 }}>
            © 2026 MELTALCARE — Sistem Monitoring Stres Pelajar Berbasis IoT
          </p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:max-w-md xl:max-w-lg">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <button
              onClick={() => router.push("/")}
              className="self-start flex items-center gap-1.5 mb-6 text-sm"
              style={{ color: "#1E6CB5", fontWeight: 500 }}
            >
              ← Kembali ke Beranda
            </button>
            <Image src={logoImg} alt="MELTALCARE Logo" width={64} height={64} className="w-16 h-16 object-contain mb-3" />
            <h1 className="text-2xl" style={{ fontWeight: 700, color: "#1A3A8F" }}>MELTALCARE</h1>
            <p className="text-sm" style={{ color: "#64748B" }}>Monitoring Indikasi Stres Pelajar</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-blue-50">
            <div className="mb-6">
              <h2 className="text-2xl" style={{ fontWeight: 700, color: "#1A3A8F" }}>Selamat Datang</h2>
              <p className="text-sm mt-1" style={{ color: "#64748B", fontWeight: 400 }}>Silakan masuk atau daftar dengan akun Google</p>
            </div>

            {/* Google Sign In Button */}
            {role === "mahasiswa" && (
              <div className="mb-6">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-3 border-2"
                  style={{
                    background: "#ffffff",
                    borderColor: "#E5E7EB",
                    color: "#374151",
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => { if (!loading) (e.target as HTMLElement).style.borderColor = "#D1D5DB"; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = "#E5E7EB"; }}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
                    <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
                    <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
                    <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
                  </svg>
                  {loading ? "Memproses..." : "Masuk dengan Google"}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-gray-500" style={{ fontWeight: 500 }}>Atau masuk dengan email</span>
                  </div>
                </div>
              </div>
            )}

            {/* Role Toggle */}
            <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
              {[
                { value: "mahasiswa", label: "Mahasiswa" },
                { value: "admin", label: "Admin" },
              ].map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value as any)}
                  className={`flex-1 py-2 rounded-lg text-sm transition-all duration-200 ${
                    role === r.value
                      ? "bg-white shadow-sm text-blue-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={{ fontWeight: role === r.value ? 600 : 400 }}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-sm mb-1.5 block" style={{ fontWeight: 500, color: "#374151" }}>
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9CA3AF" }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@student.ac.id"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm transition-all"
                    style={{
                      fontWeight: 400,
                      background: "#F9FAFB",
                      color: "#111827",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#1E6CB5"; e.target.style.boxShadow = "0 0 0 3px rgba(30,108,181,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm mb-1.5 block" style={{ fontWeight: 500, color: "#374151" }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9CA3AF" }} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl outline-none text-sm transition-all"
                    style={{
                      fontWeight: 400,
                      background: "#F9FAFB",
                      color: "#111827",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#1E6CB5"; e.target.style.boxShadow = "0 0 0 3px rgba(30,108,181,0.1)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#E5E7EB"; e.target.style.boxShadow = "none"; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword
                      ? <EyeOff className="w-4 h-4" style={{ color: "#9CA3AF" }} />
                      : <Eye className="w-4 h-4" style={{ color: "#9CA3AF" }} />
                    }
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button type="button" className="text-sm" style={{ color: "#1E6CB5", fontWeight: 500 }}>
                  Lupa password?
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2" style={{ fontWeight: 400 }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white text-sm transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  background: loading ? "#93C5FD" : "linear-gradient(135deg, #1A3A8F 0%, #1E6CB5 100%)",
                  fontWeight: 600,
                  boxShadow: loading ? "none" : "0 4px 14px rgba(30,108,181,0.35)",
                }}
                onMouseEnter={(e) => { if (!loading) (e.target as HTMLElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.transform = "translateY(0)"; }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : (
                  `Masuk sebagai ${role === "admin" ? "Admin" : "Mahasiswa"}`
                )}
              </button>
            </form>

            {role === "mahasiswa" && (
              <div
                className="flex gap-2 p-3 rounded-xl mt-6"
                style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
              >
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#10B981" }} />
                <p className="text-xs" style={{ color: "#059669", fontWeight: 400, lineHeight: 1.5 }}>
                  Mahasiswa baru bisa langsung daftar menggunakan akun Google. Tidak perlu menunggu admin untuk membuat akun.
                </p>
              </div>
            )}
          </div>

          <p className="text-center text-xs mt-4" style={{ color: "#9CA3AF", fontWeight: 400 }}>
            © 2026 MELTALCARE. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

