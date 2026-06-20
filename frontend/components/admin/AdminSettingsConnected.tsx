"use client";

import { FormEvent, useEffect, useState } from "react";
import { Bell, Database, Eye, EyeOff, Globe, Lock, Shield } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";

interface AdminSettingsData {
  institution_name: string;
  new_student_notification: boolean;
  critical_alert: boolean;
  system_update_notification: boolean;
  daily_report: boolean;
  last_backup_at: string | null;
}

const defaults: AdminSettingsData = {
  institution_name: "Politeknik Negeri Batam",
  new_student_notification: true,
  critical_alert: true,
  system_update_notification: true,
  daily_report: false,
  last_backup_at: null,
};

function downloadFile(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function AdminSettingsConnected() {
  const [settings, setSettings] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [backupBusy, setBackupBusy] = useState(false);
  const [exportBusy, setExportBusy] = useState(false);
  const userId = getCurrentUser()?.id;

  useEffect(() => {
    if (!userId) {
      setError("Data admin tidak ditemukan. Silakan login ulang.");
      setLoading(false);
      return;
    }

    apiRequest<{ data: AdminSettingsData }>(`/users/${userId}/admin-settings`)
      .then((response) => setSettings(response.data))
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Pengaturan gagal dimuat."))
      .finally(() => setLoading(false));
  }, [userId]);

  const saveSettings = async (nextSettings: AdminSettingsData, successMessage: string) => {
    if (!userId) return false;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await apiRequest<{ data: AdminSettingsData }>(`/users/${userId}/admin-settings`, {
        method: "PUT",
        body: {
          institution_name: nextSettings.institution_name,
          new_student_notification: nextSettings.new_student_notification,
          critical_alert: nextSettings.critical_alert,
          system_update_notification: nextSettings.system_update_notification,
          daily_report: nextSettings.daily_report,
        },
      });
      setSettings((current) => ({ ...response.data, last_backup_at: current.last_backup_at }));
      setMessage(successMessage);
      return true;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Pengaturan gagal disimpan.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const toggleNotification = async (key: keyof Pick<AdminSettingsData, "new_student_notification" | "critical_alert" | "system_update_notification" | "daily_report">) => {
    const previous = settings;
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    if (!await saveSettings(updated, "Preferensi notifikasi disimpan.")) setSettings(previous);
  };

  const updatePassword = async (event: FormEvent) => {
    event.preventDefault();
    setPasswordError("");
    setPasswordMessage("");
    if (!userId) return;
    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi password baru tidak sama.");
      return;
    }

    setPasswordBusy(true);
    try {
      const response = await apiRequest<{ message: string }>(`/users/${userId}/password`, {
        method: "PUT",
        body: { current_password: oldPassword, password: newPassword, password_confirmation: confirmPassword },
      });
      setPasswordMessage(response.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (requestError) {
      setPasswordError(requestError instanceof Error ? requestError.message : "Password gagal diperbarui.");
    } finally {
      setPasswordBusy(false);
    }
  };

  const backupData = async () => {
    if (!userId) return;
    setBackupBusy(true);
    setError("");
    try {
      const response = await apiRequest<{ filename: string; created_at: string; data: unknown }>(`/users/${userId}/admin-settings/backup`, { method: "POST" });
      downloadFile(response.filename, JSON.stringify(response.data, null, 2), "application/json");
      setSettings((current) => ({ ...current, last_backup_at: response.created_at }));
      setMessage("Backup data mahasiswa dan tes berhasil dibuat.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Backup gagal dibuat.");
    } finally {
      setBackupBusy(false);
    }
  };

  const exportData = async () => {
    if (!userId) return;
    setExportBusy(true);
    setError("");
    try {
      const response = await apiRequest<{ filename: string; content: string }>(`/users/${userId}/admin-settings/export`);
      downloadFile(response.filename, response.content, "text/csv;charset=utf-8");
      setMessage("Data hasil tes berhasil diekspor.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Export data gagal.");
    } finally {
      setExportBusy(false);
    }
  };

  const notifications = [
    { key: "new_student_notification" as const, label: "Mahasiswa Baru Terdaftar", desc: "Notifikasi saat ada mahasiswa baru mendaftar" },
    { key: "critical_alert" as const, label: "Peringatan Kritis", desc: "Alert untuk mahasiswa dengan tingkat stres berat" },
    { key: "system_update_notification" as const, label: "Update Sistem", desc: "Notifikasi pembaruan sistem dan maintenance" },
    { key: "daily_report" as const, label: "Laporan Harian", desc: "Siapkan ringkasan laporan harian untuk admin" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pengaturan Sistem</h1>
        <p className="mt-1 text-sm text-gray-500">Kelola konfigurasi sistem dan preferensi admin</p>
      </div>

      {error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      {message && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}

      <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <SectionTitle icon={<Globe className="h-5 w-5 text-blue-600" />} color="bg-blue-50" title="Konfigurasi Sistem" subtitle="Pengaturan umum aplikasi" />
        <div className="space-y-4">
          <FieldLabel label="Nama Institusi">
            <input value={settings.institution_name} onChange={(event) => setSettings({ ...settings, institution_name: event.target.value })} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </FieldLabel>
          <FieldLabel label="Interval Pengukuran (menit)"><input type="number" defaultValue="5" min="1" max="60" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></FieldLabel>
          <FieldLabel label="Batas Detak Jantung Normal (BPM)">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <input type="number" placeholder="Min" defaultValue="60" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              <input type="number" placeholder="Max" defaultValue="100" className="w-full rounded-xl border border-gray-200 px-4 py-2.5 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </div>
          </FieldLabel>
          <button disabled={loading || saving} onClick={() => saveSettings(settings, "Nama institusi berhasil disimpan.")} className="w-full rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50 sm:w-auto">
            {saving ? "Menyimpan..." : "Simpan Konfigurasi"}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <SectionTitle icon={<Bell className="h-5 w-5 text-amber-600" />} color="bg-amber-50" title="Notifikasi Admin" subtitle="Atur preferensi notifikasi admin" />
        <div className="space-y-4">
          {notifications.map((item) => (
            <div key={item.key} className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 p-4">
              <div><p className="text-sm font-medium text-gray-800">{item.label}</p><p className="mt-0.5 text-xs text-gray-500">{item.desc}</p></div>
              <button type="button" disabled={loading || saving} onClick={() => toggleNotification(item.key)} className={`relative h-6 w-12 flex-shrink-0 rounded-full transition-colors disabled:opacity-50 ${settings[item.key] ? "bg-blue-600" : "bg-gray-300"}`} aria-label={item.label}>
                <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${settings[item.key] ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <SectionTitle icon={<Shield className="h-5 w-5 text-emerald-600" />} color="bg-emerald-50" title="Keamanan" subtitle="Ubah password admin" />
        {passwordError && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{passwordError}</p>}
        {passwordMessage && <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{passwordMessage}</p>}
        <form onSubmit={updatePassword} className="space-y-4">
          <PasswordInput label="Password Lama" value={oldPassword} visible={showOldPassword} setValue={setOldPassword} toggle={() => setShowOldPassword(!showOldPassword)} />
          <PasswordInput label="Password Baru" value={newPassword} visible={showNewPassword} setValue={setNewPassword} toggle={() => setShowNewPassword(!showNewPassword)} />
          <PasswordInput label="Konfirmasi Password Baru" value={confirmPassword} visible={showConfirmPassword} setValue={setConfirmPassword} toggle={() => setShowConfirmPassword(!showConfirmPassword)} />
          <button type="submit" disabled={passwordBusy || !oldPassword || !newPassword || !confirmPassword} className="w-full rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50 sm:w-auto">{passwordBusy ? "Menyimpan..." : "Update Password"}</button>
        </form>
      </section>

      <section className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <SectionTitle icon={<Database className="h-5 w-5 text-purple-600" />} color="bg-purple-50" title="Database & Backup" subtitle="Kelola data mahasiswa dan hasil tes" />
        <div className="space-y-3">
          <ActionRow title="Backup Data" description={settings.last_backup_at ? `Terakhir: ${new Date(settings.last_backup_at).toLocaleString("id-ID", { timeZone: "Asia/Jakarta", dateStyle: "long", timeStyle: "short" })}` : "Belum pernah melakukan backup"} button={backupBusy ? "Memproses..." : "Backup Sekarang"} disabled={backupBusy} onClick={backupData} primary />
          <ActionRow title="Export Data" description="Download data hasil tes dalam format CSV" button={exportBusy ? "Memproses..." : "Export"} disabled={exportBusy} onClick={exportData} />
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ icon, color, title, subtitle }: { icon: React.ReactNode; color: string; title: string; subtitle: string }) {
  return <div className="mb-6 flex items-center gap-3"><div className={`rounded-lg p-2 ${color}`}>{icon}</div><div><h2 className="text-lg font-semibold text-gray-800">{title}</h2><p className="text-sm text-gray-500">{subtitle}</p></div></div>;
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-medium text-gray-600">{label}</span>{children}</label>;
}

function PasswordInput({ label, value, visible, setValue, toggle }: { label: string; value: string; visible: boolean; setValue: (value: string) => void; toggle: () => void }) {
  return <FieldLabel label={label}><div className="relative"><Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input type={visible ? "text" : "password"} value={value} onChange={(event) => setValue(event.target.value)} placeholder={`Masukkan ${label.toLowerCase()}`} className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-12 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /><button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}>{visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div></FieldLabel>;
}

function ActionRow({ title, description, button, disabled, onClick, primary = false }: { title: string; description: string; button: string; disabled: boolean; onClick: () => void; primary?: boolean }) {
  return <div className="flex flex-col gap-3 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium text-gray-800">{title}</p><p className="text-xs text-gray-500">{description}</p></div><button disabled={disabled} onClick={onClick} className={`w-full rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 sm:w-auto ${primary ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-gray-300 text-gray-700 hover:bg-gray-100"}`}>{button}</button></div>;
}
