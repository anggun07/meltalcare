"use client";

import { useEffect, useState } from "react";
import { User, Mail, Phone, Shield, Edit2, Save, X, Calendar } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { getCurrentUser, getInitials, saveSession } from "@/lib/auth";
import { DashboardData } from "@/lib/mental-health";

interface AdminProfileApi {
  id: number;
  name: string;
  email: string;
  role: "admin";
  phone: string | null;
  department: string | null;
  joined_at: string;
}

const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  role: "Super Admin",
  department: "",
  joinDate: "",
};

export function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(emptyProfile);
  const [savedData, setSavedData] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stats, setStats] = useState({ totalStudents: 0, totalTests: 0, testsThisMonth: 0, testsToday: 0 });

  useEffect(() => {
    const userId = getCurrentUser()?.id;
    if (!userId) {
      setError("Data akun admin tidak ditemukan. Silakan login ulang.");
      setLoading(false);
      return;
    }

    apiRequest<{ data: AdminProfileApi }>(`/users/${userId}/admin-profile`)
      .then((response) => {
        const profile = {
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone || "",
          role: "Super Admin",
          department: response.data.department || "",
          joinDate: response.data.joined_at,
        };
        setFormData(profile);
        setSavedData(profile);
      })
      .catch((requestError) => setError(requestError instanceof Error ? requestError.message : "Profil admin gagal dimuat."))
      .finally(() => setLoading(false));

    apiRequest<{ data: DashboardData }>("/admin/dashboard")
      .then((response) => setStats({
        totalStudents: response.data.total_students,
        totalTests: response.data.total_tests,
        testsThisMonth: response.data.tests_this_month,
        testsToday: response.data.tests_today,
      }))
      .catch(() => setStats({ totalStudents: 0, totalTests: 0, testsThisMonth: 0, testsToday: 0 }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      setError("Data akun admin tidak ditemukan. Silakan login ulang.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const response = await apiRequest<{ message: string; data: AdminProfileApi }>(`/users/${currentUser.id}/admin-profile`, {
        method: "PUT",
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
        },
      });
      const profile = {
        ...formData,
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone || "",
        department: response.data.department || "",
        joinDate: response.data.joined_at,
      };
      setFormData(profile);
      setSavedData(profile);
      saveSession({ ...currentUser, name: response.data.name, email: response.data.email });
      setSuccess(response.message);
      setIsEditing(false);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Profil admin gagal disimpan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-64 flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800 text-2xl" style={{ fontWeight: 700 }}>Profil Administrator</h1>
          <p className="text-gray-500 text-sm mt-1" style={{ fontWeight: 400 }}>
            Kelola informasi profil admin
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all duration-200 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #1A3A8F, #1E6CB5)", fontWeight: 500 }}
          >
            <Edit2 className="w-4 h-4" />
            Edit Profil
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => { setFormData(savedData); setError(""); setIsEditing(false); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
              style={{ fontWeight: 500 }}
            >
              <X className="w-4 h-4" />
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all duration-200 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #10B981, #059669)", fontWeight: 500 }}
            >
              <Save className="w-4 h-4" />
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header with gradient */}
        <div className="h-32" style={{ background: "linear-gradient(135deg, #0F2461, #1A3A8F, #1E6CB5)" }} />
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex items-start gap-6 -mt-16">
            <div 
              className="w-32 h-32 rounded-2xl flex items-center justify-center text-4xl border-4 border-white shadow-lg"
              style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)", fontWeight: 700, color: "white" }}
            >
              {getInitials(formData.name)}
            </div>
            <div className="flex-1 mt-16">
              <h2 className="text-gray-800 text-xl" style={{ fontWeight: 700 }}>{formData.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="w-4 h-4 text-amber-500" />
                <p className="text-amber-600" style={{ fontWeight: 600 }}>{formData.role}</p>
              </div>
              <div className="flex items-center gap-4 mt-3">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm" style={{ fontWeight: 500 }}>
                  {formData.department}
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm" style={{ fontWeight: 500 }}>
                  Aktif
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}
      {success && <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">{success}</div>}

      {/* Details */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-gray-800 text-lg mb-6" style={{ fontWeight: 600 }}>Informasi Detail</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-gray-600 text-sm mb-2" style={{ fontWeight: 500 }}>
              <User className="w-4 h-4" />
              Nama Lengkap
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                style={{ fontWeight: 400 }}
              />
            ) : (
              <p className="text-gray-800 px-4 py-2.5" style={{ fontWeight: 400 }}>{formData.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-gray-600 text-sm mb-2" style={{ fontWeight: 500 }}>
              <Mail className="w-4 h-4" />
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                style={{ fontWeight: 400 }}
              />
            ) : (
              <p className="text-gray-800 px-4 py-2.5" style={{ fontWeight: 400 }}>{formData.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-gray-600 text-sm mb-2" style={{ fontWeight: 500 }}>
              <Phone className="w-4 h-4" />
              Nomor Telepon
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                style={{ fontWeight: 400 }}
              />
            ) : (
              <p className="text-gray-800 px-4 py-2.5" style={{ fontWeight: 400 }}>{formData.phone}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="flex items-center gap-2 text-gray-600 text-sm mb-2" style={{ fontWeight: 500 }}>
              <Shield className="w-4 h-4" />
              Role
            </label>
            <p className="text-gray-800 px-4 py-2.5" style={{ fontWeight: 400 }}>{formData.role}</p>
          </div>

          {/* Department */}
          <div>
            <label className="flex items-center gap-2 text-gray-600 text-sm mb-2" style={{ fontWeight: 500 }}>
              <User className="w-4 h-4" />
              Departemen
            </label>
            {isEditing ? (
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            ) : (
              <p className="text-gray-800 px-4 py-2.5" style={{ fontWeight: 400 }}>{formData.department || "-"}</p>
            )}
          </div>

          {/* Join Date */}
          <div>
            <label className="flex items-center gap-2 text-gray-600 text-sm mb-2" style={{ fontWeight: 500 }}>
              <Calendar className="w-4 h-4" />
              Tanggal Bergabung
            </label>
            <p className="text-gray-800 px-4 py-2.5" style={{ fontWeight: 400 }}>
              {formData.joinDate ? new Date(formData.joinDate).toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta', day: 'numeric', month: 'long', year: 'numeric' }) : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        className="grid gap-3 sm:gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))" }}
      >
        {[
          { label: "Total Mahasiswa", value: stats.totalStudents.toLocaleString("id-ID"), color: "#2563EB" },
          { label: "Total Tes Keseluruhan", value: stats.totalTests.toLocaleString("id-ID"), color: "#4F46E5" },
          { label: "Total Tes Bulan Ini", value: stats.testsThisMonth.toLocaleString("id-ID"), color: "#D97706" },
          { label: "Total Tes Hari Ini", value: stats.testsToday.toLocaleString("id-ID"), color: "#059669" },
          { label: "Perangkat IoT Aktif", value: "8/8", color: "#7C3AED" },
        ].map((stat) => (
          <div key={stat.label} className="flex min-h-28 flex-col justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
            <p className="text-xs font-medium leading-5 text-gray-500 sm:text-sm">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold sm:text-3xl" style={{ color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

