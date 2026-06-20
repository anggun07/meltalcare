"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  Brain,
  Eye,
  EyeOff,
  Hash,
  Heart,
  Lock,
  LogIn,
  Mail,
  User,
  UserPlus,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { saveSession } from "@/lib/auth";

const logoImg = "/logo.svg";

type Role = "mahasiswa" | "admin";
type AuthMode = "login" | "register";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  student?: {
    id: number;
    nim: string;
    name: string;
  } | null;
}

interface AuthResponse {
  message: string;
  data: AuthUser;
}

export function Login({ initialMode = "login" }: { initialMode?: AuthMode }) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [role, setRole] = useState<Role>("mahasiswa");
  const [name, setName] = useState("");
  const [nim, setNim] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isRegister = mode === "register";

  const resetFeedback = () => setError("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const result = await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: { email, password, role },
      });

      saveSession(result.data);
      router.push(result.data.role === "admin" ? "/admin/dashboard" : "/student/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !nim.trim() || !password) {
      setError("Nama, email, NIM, dan password wajib diisi.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);
    try {
      const result = await apiRequest<AuthResponse>("/auth/register", {
        method: "POST",
        body: {
          name,
          email,
          password,
          role: "mahasiswa",
          nim,
        },
      });

      saveSession(result.data);
      router.push("/student/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetFeedback();

    if (isRegister) {
      await handleRegister();
      return;
    }

    await handleLogin();
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setRole("mahasiswa");
    setPassword("");
    setConfirmPassword("");
    setError("");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #EEF2FF 100%)" }}>
      <div
        className="hidden lg:flex flex-col justify-between flex-1 p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #1A3A8F 0%, #1E6CB5 50%, #29ABE2 100%)" }}
      >
        <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full opacity-10 bg-white" />
        <div className="absolute bottom-[-60px] left-[-60px] w-64 h-64 rounded-full opacity-10 bg-white" />

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
          >
            <ArrowLeft className="w-4 h-4" />
            Beranda
          </button>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-64 h-64 mb-8 relative">
            <svg viewBox="0 0 300 200" className="w-full h-auto" fill="none">
              <rect x="20" y="20" width="260" height="160" rx="12" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
              {[50, 80, 110, 140, 170].map((y) => (
                <line key={y} x1="30" y1={y} x2="270" y2={y} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              ))}
              {[70, 120, 170, 220].map((x) => (
                <line key={x} x1={x} y1="30" x2={x} y2="170" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
              ))}
              <polyline
                points="30,110 60,110 75,110 82,60 90,155 98,110 110,110 130,110 140,110 148,65 156,150 163,110 175,110 195,110 205,110 213,70 221,148 228,110 240,110 270,110"
                fill="none"
                stroke="#29ABE2"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="270" cy="110" r="5" fill="#4FC3F7" opacity="0.9" />
            </svg>

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
            Akses Akun Meltalcare
          </h2>
          <p className="text-blue-200 text-base max-w-sm" style={{ fontWeight: 400, lineHeight: 1.7 }}>
            Mahasiswa masuk dengan email, password, dan NIM yang valid. Admin masuk memakai akun yang sudah dibuat di backend.
          </p>

          <div className="flex flex-wrap gap-3 mt-6 justify-center">
            {[
              { icon: Mail, label: "Email Login" },
              { icon: Hash, label: "Validasi NIM" },
              { icon: Brain, label: "Dashboard" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 bg-white/15 rounded-full px-4 py-2 border border-white/20">
                <Icon className="w-4 h-4 text-blue-200" />
                <span className="text-white text-sm" style={{ fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-blue-300 text-sm" style={{ fontWeight: 400 }}>
          Copyright 2026 MELTALCARE
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:max-w-md xl:max-w-lg">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex flex-col items-center mb-8">
            <button
              onClick={() => router.push("/")}
              className="self-start flex items-center gap-1.5 mb-6 text-sm"
              style={{ color: "#1E6CB5", fontWeight: 500 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Beranda
            </button>
            <Image src={logoImg} alt="MELTALCARE Logo" width={64} height={64} className="w-16 h-16 object-contain mb-3" />
            <h1 className="text-2xl" style={{ fontWeight: 700, color: "#1A3A8F" }}>MELTALCARE</h1>
            <p className="text-sm" style={{ color: "#64748B" }}>Monitoring Indikasi Stres Pelajar</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-xl border border-blue-50">
            <div className="mb-6">
              <h2 className="text-2xl" style={{ fontWeight: 700, color: "#1A3A8F" }}>
                {isRegister ? "Daftar Mahasiswa" : "Masuk Akun"}
              </h2>
              <p className="text-sm mt-1" style={{ color: "#64748B", fontWeight: 400 }}>
                {isRegister ? "Buat akun memakai email dan NIM." : "Masuk memakai akun yang sudah terdaftar."}
              </p>
            </div>

            <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
              {[
                { value: "login", label: "Masuk" },
                { value: "register", label: "Daftar" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => switchMode(item.value as AuthMode)}
                  className={`flex-1 py-2 rounded-lg text-sm transition-all duration-200 ${
                    mode === item.value ? "bg-white shadow-sm text-blue-700" : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={{ fontWeight: mode === item.value ? 600 : 400 }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {!isRegister && (
              <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
                {[
                  { value: "mahasiswa", label: "Mahasiswa" },
                  { value: "admin", label: "Admin" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setRole(item.value as Role)}
                    className={`flex-1 py-2 rounded-lg text-sm transition-all duration-200 ${
                      role === item.value ? "bg-white shadow-sm text-blue-700" : "text-gray-500 hover:text-gray-700"
                    }`}
                    style={{ fontWeight: role === item.value ? 600 : 400 }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <>
                  <Field label="Nama Lengkap" icon={<User className="w-4 h-4" style={{ color: "#9CA3AF" }} />}>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Ahmad Fauzi"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm transition-all"
                      style={{ fontWeight: 400, background: "#F9FAFB", color: "#111827" }}
                    />
                  </Field>

                  <Field label="NIM" icon={<Hash className="w-4 h-4" style={{ color: "#9CA3AF" }} />}>
                    <input
                      type="text"
                      value={nim}
                      onChange={(e) => setNim(e.target.value.replace(/\D/g, ""))}
                      placeholder="Contoh: 20210005"
                      maxLength={12}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm transition-all"
                      style={{ fontWeight: 400, background: "#F9FAFB", color: "#111827" }}
                    />
                  </Field>
                </>
              )}

              <Field label="Email" icon={<Mail className="w-4 h-4" style={{ color: "#9CA3AF" }} />}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@student.ac.id"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm transition-all"
                  style={{ fontWeight: 400, background: "#F9FAFB", color: "#111827" }}
                />
              </Field>

              <Field label="Password" icon={<Lock className="w-4 h-4" style={{ color: "#9CA3AF" }} />}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl outline-none text-sm transition-all"
                  style={{ fontWeight: 400, background: "#F9FAFB", color: "#111827" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" style={{ color: "#9CA3AF" }} /> : <Eye className="w-4 h-4" style={{ color: "#9CA3AF" }} />}
                </button>
              </Field>

              {isRegister && (
                <Field label="Konfirmasi Password" icon={<Lock className="w-4 h-4" style={{ color: "#9CA3AF" }} />}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm transition-all"
                    style={{ fontWeight: 400, background: "#F9FAFB", color: "#111827" }}
                  />
                </Field>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2" style={{ fontWeight: 400 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white text-sm transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  background: loading ? "#93C5FD" : "linear-gradient(135deg, #1A3A8F 0%, #1E6CB5 100%)",
                  fontWeight: 600,
                  boxShadow: loading ? "none" : "0 4px 14px rgba(30,108,181,0.35)",
                }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Memproses...
                  </>
                ) : isRegister ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Daftar Mahasiswa
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Masuk sebagai {role === "admin" ? "Admin" : "Mahasiswa"}
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs mt-4" style={{ color: "#9CA3AF", fontWeight: 400 }}>
            Copyright 2026 MELTALCARE. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm mb-1.5 block" style={{ fontWeight: 500, color: "#374151" }}>
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>
        {children}
      </div>
    </div>
  );
}
