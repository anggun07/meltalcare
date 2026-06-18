"use client";

import { useState } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from "lucide-react";

export function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "Ahmad Fauzi",
    nim: "20210001",
    email: "ahmad.fauzi@student.ac.id",
    phone: "081234567890",
    address: "Jl. Pendidikan No. 123, Jakarta",
    dateOfBirth: "2002-05-15",
    faculty: "Fakultas Teknik",
    major: "Teknik Informatika",
    semester: "6",
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
          <h1 className="text-gray-800 text-2xl" style={{ fontWeight: 700 }}>Profil Mahasiswa</h1>
          <p className="text-gray-500 text-sm mt-1" style={{ fontWeight: 400 }}>
            Kelola informasi pribadi Anda
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white transition-all duration-200 hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #1A3A8F, #29ABE2)", fontWeight: 500 }}
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
        <div className="h-32" style={{ background: "linear-gradient(135deg, #1A3A8F, #29ABE2)" }} />
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex items-start gap-6 -mt-16">
            <div 
              className="w-32 h-32 rounded-2xl flex items-center justify-center text-4xl border-4 border-white shadow-lg"
              style={{ background: "linear-gradient(135deg, #29ABE2, #4FC3F7)", fontWeight: 700, color: "white" }}
            >
              AF
            </div>
            <div className="flex-1 mt-16">
              <h2 className="text-gray-800 text-xl" style={{ fontWeight: 700 }}>{formData.name}</h2>
              <p className="text-gray-500" style={{ fontWeight: 500 }}>NIM: {formData.nim}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm" style={{ fontWeight: 500 }}>
                  {formData.major}
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm" style={{ fontWeight: 500 }}>
                  Semester {formData.semester}
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

          {/* Date of Birth */}
          <div>
            <label className="flex items-center gap-2 text-gray-600 text-sm mb-2" style={{ fontWeight: 500 }}>
              <Calendar className="w-4 h-4" />
              Tanggal Lahir
            </label>
            {isEditing ? (
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                style={{ fontWeight: 400 }}
              />
            ) : (
              <p className="text-gray-800 px-4 py-2.5" style={{ fontWeight: 400 }}>
                {new Date(formData.dateOfBirth).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>

          {/* Faculty */}
          <div>
            <label className="flex items-center gap-2 text-gray-600 text-sm mb-2" style={{ fontWeight: 500 }}>
              <User className="w-4 h-4" />
              Fakultas
            </label>
            <p className="text-gray-800 px-4 py-2.5" style={{ fontWeight: 400 }}>{formData.faculty}</p>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-gray-600 text-sm mb-2" style={{ fontWeight: 500 }}>
              <MapPin className="w-4 h-4" />
              Alamat
            </label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                style={{ fontWeight: 400 }}
              />
            ) : (
              <p className="text-gray-800 px-4 py-2.5" style={{ fontWeight: 400 }}>{formData.address}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

