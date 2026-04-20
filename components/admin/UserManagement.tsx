"use client";

import { useState } from "react";
import { Search, UserPlus, Edit2, Trash2, Shield, Mail, Phone, MoreVertical } from "lucide-react";

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "admin" | "moderator">("all");

  const users = [
    { id: 1, name: "Administrator", email: "admin@meltalcare.ac.id", phone: "081234567890", role: "Super Admin", status: "Aktif", color: "amber" },
    { id: 2, name: "Dr. Budi Santoso", email: "budi.s@meltalcare.ac.id", phone: "081234567891", role: "Admin", status: "Aktif", color: "blue" },
    { id: 3, name: "Siti Nurhaliza", email: "siti.n@meltalcare.ac.id", phone: "081234567892", role: "Moderator", status: "Aktif", color: "emerald" },
    { id: 4, name: "Ahmad Yani", email: "ahmad.y@meltalcare.ac.id", phone: "081234567893", role: "Moderator", status: "Nonaktif", color: "emerald" },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || 
                      (activeTab === "admin" && user.role.includes("Admin")) ||
                      (activeTab === "moderator" && user.role === "Moderator");
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-800 text-2xl" style={{ fontWeight: 700 }}>Kelola Pengguna</h1>
          <p className="text-gray-500 text-sm mt-1" style={{ fontWeight: 400 }}>
            Manajemen admin dan moderator sistem
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white transition-all duration-200 hover:shadow-lg"
          style={{ background: "linear-gradient(135deg, #1A3A8F, #1E6CB5)", fontWeight: 500 }}
        >
          <UserPlus className="w-4 h-4" />
          Tambah Pengguna
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Pengguna", value: "4", color: "blue", icon: Shield },
          { label: "Super Admin", value: "1", color: "amber", icon: Shield },
          { label: "Admin", value: "1", color: "blue", icon: Shield },
          { label: "Moderator", value: "2", color: "emerald", icon: Shield },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm" style={{ fontWeight: 500 }}>{stat.label}</p>
                  <p className={`text-${stat.color}-600 text-2xl mt-1`} style={{ fontWeight: 700 }}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau email pengguna..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            style={{ fontWeight: 400 }}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {[
            { key: "all", label: "Semua" },
            { key: "admin", label: "Admin" },
            { key: "moderator", label: "Moderator" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={{ fontWeight: 500 }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-gray-600 text-xs uppercase tracking-wider" style={{ fontWeight: 600 }}>
                  Pengguna
                </th>
                <th className="px-6 py-4 text-left text-gray-600 text-xs uppercase tracking-wider" style={{ fontWeight: 600 }}>
                  Kontak
                </th>
                <th className="px-6 py-4 text-left text-gray-600 text-xs uppercase tracking-wider" style={{ fontWeight: 600 }}>
                  Role
                </th>
                <th className="px-6 py-4 text-left text-gray-600 text-xs uppercase tracking-wider" style={{ fontWeight: 600 }}>
                  Status
                </th>
                <th className="px-6 py-4 text-right text-gray-600 text-xs uppercase tracking-wider" style={{ fontWeight: 600 }}>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-sm"
                        style={{ background: `linear-gradient(135deg, var(--color-${user.color}-500), var(--color-${user.color}-600))`, fontWeight: 700, color: "white" }}
                      >
                        {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <p className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{user.name}</p>
                        <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                      <Phone className="w-3.5 h-3.5" />
                      {user.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs bg-${user.color}-50 text-${user.color}-700`} style={{ fontWeight: 500 }}>
                      <Shield className="w-3 h-3" />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs ${
                      user.status === "Aktif" ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"
                    }`} style={{ fontWeight: 500 }}>
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Aktif" ? "bg-emerald-500" : "bg-gray-400"}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 relative z-10">
                      <button 
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Edit pengguna: ${user.name}`);
                        }}
                        title="Edit pengguna"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Hapus pengguna ${user.name}?`)) {
                            alert(`Pengguna ${user.name} dihapus`);
                          }
                        }}
                        title="Hapus pengguna"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Menu lainnya untuk ${user.name}`);
                        }}
                        title="Menu lainnya"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400" style={{ fontWeight: 500 }}>Tidak ada pengguna ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}
