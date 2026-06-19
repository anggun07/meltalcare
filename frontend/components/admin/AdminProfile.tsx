"use client";

import { useState } from "react";
import { User, Mail, Phone, Shield, Edit2, Save, X, Calendar } from "lucide-react";

export function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Administrator",
    email: "admin@meltalcare.ac.id",
    phone: "081234567890",
    role: "Super Admin",
    department: "IT & System Management",
    joinDate: "2024-01-15",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

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
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
              style={{ fontWeight: 500 }}
            >
              <X className="w-4 h-4" />
              Batal
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all duration-200 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #10B981, #059669)", fontWeight: 500 }}
            >
              <Save className="w-4 h-4" />
              Simpan
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
              AD
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
            <p className="text-gray-800 px-4 py-2.5" style={{ fontWeight: 400 }}>{formData.department}</p>
          </div>

          {/* Join Date */}
          <div>
            <label className="flex items-center gap-2 text-gray-600 text-sm mb-2" style={{ fontWeight: 500 }}>
              <Calendar className="w-4 h-4" />
              Tanggal Bergabung
            </label>
            <p className="text-gray-800 px-4 py-2.5" style={{ fontWeight: 400 }}>
              {new Date(formData.joinDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Mahasiswa", value: "1,247", color: "blue" },
          { label: "Total Tes Hari Ini", value: "89", color: "emerald" },
          { label: "Perangkat IoT Aktif", value: "8/8", color: "purple" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-500 text-sm" style={{ fontWeight: 500 }}>{stat.label}</p>
            <p className={`text-${stat.color}-600 text-3xl mt-2`} style={{ fontWeight: 700 }}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

