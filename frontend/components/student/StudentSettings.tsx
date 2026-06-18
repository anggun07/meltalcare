"use client";

import { useState } from "react";
import { Bell, Lock, Eye, EyeOff, Shield, Smartphone } from "lucide-react";

export function StudentSettings() {
  const [notifications, setNotifications] = useState({
    testReminder: true,
    stressAlert: true,
    heartRateAlert: false,
    emailNotif: true,
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-800 text-2xl" style={{ fontWeight: 700 }}>Pengaturan</h1>
        <p className="text-gray-500 text-sm mt-1" style={{ fontWeight: 400 }}>
          Kelola preferensi dan keamanan akun Anda
        </p>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-50">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-gray-800 text-lg" style={{ fontWeight: 600 }}>Notifikasi</h2>
            <p className="text-gray-500 text-sm" style={{ fontWeight: 400 }}>Atur preferensi notifikasi</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: "testReminder", label: "Pengingat Tes Kesehatan Mental", desc: "Dapatkan pengingat untuk melakukan tes berkala" },
            { key: "stressAlert", label: "Peringatan Tingkat Stres", desc: "Notifikasi saat terdeteksi tingkat stres tinggi" },
            { key: "heartRateAlert", label: "Peringatan Detak Jantung", desc: "Notifikasi saat detak jantung tidak normal" },
            { key: "emailNotif", label: "Notifikasi Email", desc: "Terima notifikasi melalui email" },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <div className="flex-1">
                <p className="text-gray-800 text-sm" style={{ fontWeight: 500 }}>{item.label}</p>
                <p className="text-gray-500 text-xs mt-0.5" style={{ fontWeight: 400 }}>{item.desc}</p>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                className={`relative w-12 h-6 rounded-full transition-all duration-200 ${
                  notifications[item.key as keyof typeof notifications] ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                    notifications[item.key as keyof typeof notifications] ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-emerald-50">
            <Shield className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-gray-800 text-lg" style={{ fontWeight: 600 }}>Keamanan</h2>
            <p className="text-gray-500 text-sm" style={{ fontWeight: 400 }}>Ubah password dan kelola keamanan</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Old Password */}
          <div>
            <label className="flex items-center gap-2 text-gray-600 text-sm mb-2" style={{ fontWeight: 500 }}>
              <Lock className="w-4 h-4" />
              Password Lama
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Masukkan password lama"
                className="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                style={{ fontWeight: 400 }}
              />
              <button
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="flex items-center gap-2 text-gray-600 text-sm mb-2" style={{ fontWeight: 500 }}>
              <Lock className="w-4 h-4" />
              Password Baru
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Masukkan password baru"
                className="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                style={{ fontWeight: 400 }}
              />
              <button
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="flex items-center gap-2 text-gray-600 text-sm mb-2" style={{ fontWeight: 500 }}>
              <Lock className="w-4 h-4" />
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Konfirmasi password baru"
                className="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                style={{ fontWeight: 400 }}
              />
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            className="w-full md:w-auto px-6 py-2.5 rounded-xl text-white transition-all duration-200 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #1A3A8F, #29ABE2)", fontWeight: 500 }}
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Connected Devices */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-50">
            <Smartphone className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-gray-800 text-lg" style={{ fontWeight: 600 }}>Perangkat Terhubung</h2>
            <p className="text-gray-500 text-sm" style={{ fontWeight: 400 }}>Kelola perangkat yang terhubung ke akun Anda</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { device: "Chrome on Windows", location: "Jakarta, Indonesia", date: "Aktif sekarang", active: true },
            { device: "Safari on iPhone", location: "Jakarta, Indonesia", date: "2 hari yang lalu", active: false },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${item.active ? "bg-emerald-500" : "bg-gray-300"}`} />
                <div>
                  <p className="text-gray-800 text-sm" style={{ fontWeight: 500 }}>{item.device}</p>
                  <p className="text-gray-500 text-xs" style={{ fontWeight: 400 }}>
                    {item.location} • {item.date}
                  </p>
                </div>
              </div>
              {!item.active && (
                <button className="text-red-600 text-sm hover:text-red-700" style={{ fontWeight: 500 }}>
                  Hapus
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

