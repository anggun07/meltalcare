"use client";

import { FormEvent, useEffect, useState } from "react";
import { Bell, Eye, EyeOff, Lock, Shield } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";

interface NotificationSettings {
  test_reminder: boolean;
  stress_alert: boolean;
}

interface PasswordFieldProps {
  label: string;
  placeholder: string;
  value: string;
  visible: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}

function PasswordField({ label, placeholder, value, visible, onChange, onToggle }: PasswordFieldProps) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-600">
        <Lock className="h-4 w-4" /> {label}
      </label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={label === "Password Lama" ? "current-password" : "new-password"}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-12 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}>
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
}

export function StudentSettingsConnected() {
  const [notifications, setNotifications] = useState<NotificationSettings>({ test_reminder: true, stress_alert: true });
  const [heartRateAlert, setHeartRateAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingSetting, setSavingSetting] = useState<keyof NotificationSettings | null>(null);
  const [settingMessage, setSettingMessage] = useState("");
  const [settingError, setSettingError] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const userId = getCurrentUser()?.id;

  useEffect(() => {
    if (!userId) {
      setSettingError("Data akun tidak ditemukan. Silakan login ulang.");
      setLoading(false);
      return;
    }

    apiRequest<{ data: NotificationSettings }>(`/users/${userId}/settings`)
      .then((response) => setNotifications(response.data))
      .catch((error) => setSettingError(error instanceof Error ? error.message : "Gagal mengambil pengaturan."))
      .finally(() => setLoading(false));
  }, [userId]);

  const toggleSetting = async (key: keyof NotificationSettings) => {
    if (!userId || savingSetting) return;
    const previous = notifications;
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    setSavingSetting(key);
    setSettingError("");
    setSettingMessage("");

    try {
      await apiRequest(`/users/${userId}/settings`, { method: "PUT", body: updated });
      setSettingMessage("Pengaturan berhasil disimpan.");
    } catch (error) {
      setNotifications(previous);
      setSettingError(error instanceof Error ? error.message : "Pengaturan gagal disimpan.");
    } finally {
      setSavingSetting(null);
    }
  };

  const updatePassword = async (event: FormEvent) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (!userId) {
      setPasswordError("Data akun tidak ditemukan. Silakan login ulang.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password baru tidak sama.");
      return;
    }

    setUpdatingPassword(true);
    try {
      const response = await apiRequest<{ message: string }>(`/users/${userId}/password`, {
        method: "PUT",
        body: { current_password: oldPassword, password: newPassword, password_confirmation: confirmPassword },
      });
      setPasswordMessage(response.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Password gagal diperbarui.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const notificationItems: Array<{ key: keyof NotificationSettings; label: string; desc: string }> = [
    { key: "test_reminder", label: "Pengingat Tes Kesehatan Mental", desc: "Dapatkan pengingat untuk melakukan tes berkala" },
    { key: "stress_alert", label: "Peringatan Tingkat Stres", desc: "Notifikasi saat hasil tes menunjukkan tingkat stres tinggi" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan</h1>
        <p className="mt-1 text-sm text-gray-500">Kelola preferensi dan keamanan akun Anda</p>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-2"><Bell className="h-5 w-5 text-blue-600" /></div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Notifikasi</h2>
            <p className="text-sm text-gray-500">Atur preferensi notifikasi dalam aplikasi</p>
          </div>
        </div>
        {settingError && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{settingError}</p>}
        {settingMessage && <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{settingMessage}</p>}
        <div className="space-y-4">
          {notificationItems.map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 p-4">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                <p className="mt-0.5 text-xs text-gray-500">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => toggleSetting(item.key)}
                disabled={loading || savingSetting !== null}
                className={`relative h-6 w-12 flex-shrink-0 rounded-full transition-colors disabled:opacity-50 ${notifications[item.key] ? "bg-blue-600" : "bg-gray-300"}`}
                aria-label={`${notifications[item.key] ? "Nonaktifkan" : "Aktifkan"} ${item.label}`}
              >
                <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${notifications[item.key] ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>
          ))}
          <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 p-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">Peringatan Detak Jantung</p>
              <p className="mt-0.5 text-xs text-gray-500">Notifikasi saat detak jantung tidak normal</p>
            </div>
            <button
              type="button"
              onClick={() => setHeartRateAlert((value) => !value)}
              className={`relative h-6 w-12 flex-shrink-0 rounded-full transition-colors ${heartRateAlert ? "bg-blue-600" : "bg-gray-300"}`}
              aria-label={`${heartRateAlert ? "Nonaktifkan" : "Aktifkan"} Peringatan Detak Jantung`}
            >
              <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${heartRateAlert ? "translate-x-6" : "translate-x-0"}`} />
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-emerald-50 p-2"><Shield className="h-5 w-5 text-emerald-600" /></div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Keamanan</h2>
            <p className="text-sm text-gray-500">Ubah password akun Anda</p>
          </div>
        </div>
        {passwordError && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{passwordError}</p>}
        {passwordMessage && <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{passwordMessage}</p>}
        <form onSubmit={updatePassword} className="space-y-4">
          <PasswordField label="Password Lama" placeholder="Masukkan password lama" value={oldPassword} visible={showOldPassword} onChange={setOldPassword} onToggle={() => setShowOldPassword((value) => !value)} />
          <PasswordField label="Password Baru" placeholder="Masukkan password baru" value={newPassword} visible={showNewPassword} onChange={setNewPassword} onToggle={() => setShowNewPassword((value) => !value)} />
          <PasswordField label="Konfirmasi Password Baru" placeholder="Konfirmasi password baru" value={confirmPassword} visible={showConfirmPassword} onChange={setConfirmPassword} onToggle={() => setShowConfirmPassword((value) => !value)} />
          <button type="submit" disabled={updatingPassword || !oldPassword || !newPassword || !confirmPassword} className="w-full rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto">
            {updatingPassword ? "Menyimpan..." : "Update Password"}
          </button>
        </form>
      </section>
    </div>
  );
}
