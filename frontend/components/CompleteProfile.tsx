"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Hash, ArrowRight, CheckCircle } from "lucide-react";
const logoImg = "/logo.svg";

export function CompleteProfile() {
  const router = useRouter();
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [nim, setNim] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get temp Google user data
    const tempUser = localStorage.getItem("meltalcare_temp_google_user");
    if (!tempUser) {
      // No Google user, redirect to login
      router.push("/login");
      return;
    }

    const user = JSON.parse(tempUser);
    setGoogleUser(user);
    setFullName(user.name || "");
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }

    if (!nim.trim()) {
      setError("NIM wajib diisi.");
      return;
    }

    if (nim.length < 8) {
      setError("NIM minimal 8 digit.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Create new user
      const newUser = {
        email: googleUser.email,
        name: fullName,
        nim: nim,
        role: "mahasiswa",
        picture: googleUser.picture,
        googleId: googleUser.googleId,
        createdAt: new Date().toISOString(),
      };

      // Save to users list
      const existingUsers = JSON.parse(localStorage.getItem("meltalcare_users") || "[]");
      existingUsers.push(newUser);
      localStorage.setItem("meltalcare_users", JSON.stringify(existingUsers));

      // Set as current user
      localStorage.setItem("meltalcare_current_user", JSON.stringify(newUser));

      // Remove temp user
      localStorage.removeItem("meltalcare_temp_google_user");

      setLoading(false);

      // Redirect to student dashboard
      router.push("/student/dashboard");
    }, 1000);
  };

  if (!googleUser) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #EEF2FF 100%)" }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image src={logoImg} alt="MELTALCARE Logo" width={64} height={64} className="w-16 h-16 object-contain mb-3" />
          <h1 className="text-2xl" style={{ fontWeight: 700, color: "#1A3A8F" }}>MELTALCARE</h1>
          <p className="text-sm" style={{ color: "#64748B" }}>Monitoring Indikasi Stres Pelajar</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-blue-50">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden border-4 border-blue-100">
              <Image src={googleUser.picture} alt={googleUser.name} width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl mb-2" style={{ fontWeight: 700, color: "#1A3A8F" }}>Lengkapi Profil Anda</h2>
            <p className="text-sm" style={{ color: "#64748B", fontWeight: 400 }}>
              Akun Google terhubung: <strong>{googleUser.email}</strong>
            </p>
          </div>

          {/* Success Banner */}
          <div
            className="flex gap-3 p-3.5 rounded-xl mb-6"
            style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#10B981" }} />
            <div>
              <p className="text-xs" style={{ fontWeight: 600, color: "#059669" }}>
                Akun Google berhasil terhubung!
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#10B981", fontWeight: 400, lineHeight: 1.5 }}>
                Lengkapi data berikut untuk menyelesaikan pendaftaran Anda.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-sm mb-1.5 block" style={{ fontWeight: 500, color: "#374151" }}>
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9CA3AF" }} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Ahmad Fauzi"
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

            {/* NIM */}
            <div>
              <label className="text-sm mb-1.5 block" style={{ fontWeight: 500, color: "#374151" }}>
                NIM (Nomor Induk Mahasiswa) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#9CA3AF" }} />
                <input
                  type="text"
                  value={nim}
                  onChange={(e) => setNim(e.target.value.replace(/\D/g, ""))}
                  placeholder="Contoh: 20210001"
                  maxLength={12}
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
              <p className="text-xs mt-1.5" style={{ color: "#6B7280", fontWeight: 400 }}>
                Masukkan NIM sesuai dengan yang terdaftar di kampus
              </p>
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
                  Menyimpan...
                </>
              ) : (
                <>
                  Selesaikan Pendaftaran
                  <ArrowRight className="w-4 h-4" />
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
  );
}


