"use client";

import { useState } from "react";
import { Bell, Lock, Eye, EyeOff, Shield, Database, Globe } from "lucide-react";

export function AdminSettings() {
  const [notifications, setNotifications] = useState({
    newStudent: true,
    criticalAlert: true,
    systemUpdate: true,
    dailyReport: false,
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-gray-800 text-2xl" style={{ fontWeight: 700 }}>Pengaturan Sistem</h1>
        <p className="text-gray-500 text-sm mt-1" style={{ fontWeight: 400 }}>
          Kelola konfigurasi sistem dan preferensi admin
        </p>
      </div>

      {/* System Configuration */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-50">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-gray-800 text-lg" style={{ fontWeight: 600 }}>Konfigurasi Sistem</h2>
            <p className="text-gray-500 text-sm" style={{ fontWeight: 400 }}>Pengaturan umum aplikasi</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-gray-600 text-sm mb-2 block" style={{ fontWeight: 500 }}>
              Nama Institusi
            </label>
            <input
              type="text"
              defaultValue="Universitas Teknologi Indonesia"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              style={{ fontWeight: 400 }}
            />
          </div>

          <div>
            <label className="text-gray-600 text-sm mb-2 block" style={{ fontWeight: 500 }}>
              Interval Pengukuran (menit)
            </label>
            <input
              type="number"
              defaultValue="5"
              min="1"
              max="60"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              style={{ fontWeight: 400 }}
            />
          </div>

          <div>
            <label className="text-gray-600 text-sm mb-2 block" style={{ fontWeight: 500 }}>
              Batas Detak Jantung Normal (BPM)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  placeholder="Min"
                  defaultValue="60"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  style={{ fontWeight: 400 }}
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Max"
                  defaultValue="100"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  style={{ fontWeight: 400 }}
                />
              </div>
            </div>
          </div>

          <button
            className="w-full md:w-auto px-6 py-2.5 rounded-xl text-white transition-all duration-200 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #1A3A8F, #1E6CB5)", fontWeight: 500 }}
          >
            Simpan Konfigurasi
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-amber-50">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-gray-800 text-lg" style={{ fontWeight: 600 }}>Notifikasi Admin</h2>
            <p className="text-gray-500 text-sm" style={{ fontWeight: 400 }}>Atur preferensi notifikasi admin</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { key: "newStudent", label: "Mahasiswa Baru Terdaftar", desc: "Notifikasi saat ada mahasiswa baru mendaftar" },
            { key: "criticalAlert", label: "Peringatan Kritis", desc: "Alert untuk mahasiswa dengan tingkat stres berat" },
            { key: "systemUpdate", label: "Update Sistem", desc: "Notifikasi pembaruan sistem dan maintenance" },
            { key: "dailyReport", label: "Laporan Harian", desc: "Terima laporan harian via email" },
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
            <p className="text-gray-500 text-sm" style={{ fontWeight: 400 }}>Ubah password admin</p>
          </div>
        </div>

        <div className="space-y-4">
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
            style={{ background: "linear-gradient(135deg, #1A3A8F, #1E6CB5)", fontWeight: 500 }}
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Database */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-purple-50">
            <Database className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-gray-800 text-lg" style={{ fontWeight: 600 }}>Database & Backup</h2>
            <p className="text-gray-500 text-sm" style={{ fontWeight: 400 }}>Kelola data dan backup sistem</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
            <div>
              <p className="text-gray-800 text-sm" style={{ fontWeight: 500 }}>Backup Otomatis</p>
              <p className="text-gray-500 text-xs" style={{ fontWeight: 400 }}>Terakhir: 1 April 2026, 02:00</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors" style={{ fontWeight: 500 }}>
              Backup Sekarang
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
            <div>
              <p className="text-gray-800 text-sm" style={{ fontWeight: 500 }}>Export Data</p>
              <p className="text-gray-500 text-xs" style={{ fontWeight: 400 }}>Download semua data dalam format CSV</p>
            </div>
            <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-100 transition-colors" style={{ fontWeight: 500 }}>
              Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

