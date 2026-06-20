"use client";

import { useEffect, useMemo, useState } from "react";
import { Hash, Mail, RefreshCw, Search, Shield, UserRound } from "lucide-react";
import { apiRequest } from "@/lib/api";

type UserRole = "admin" | "mahasiswa";

interface BackendUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
  student?: {
    id: number;
    nim: string;
    name: string;
  } | null;
}

interface UsersResponse {
  data: BackendUser[];
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | UserRole>("all");
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await apiRequest<UsersResponse>("/users");
      setUsers(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil data user.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const keyword = searchQuery.toLowerCase();
      const matchesSearch =
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        (user.student?.nim || "").includes(searchQuery);
      const matchesTab = activeTab === "all" || user.role === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [activeTab, searchQuery, users]);

  const stats = {
    total: users.length,
    admin: users.filter((user) => user.role === "admin").length,
    mahasiswa: users.filter((user) => user.role === "mahasiswa").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-800 text-2xl" style={{ fontWeight: 700 }}>Kelola Pengguna</h1>
          <p className="text-gray-500 text-sm mt-1" style={{ fontWeight: 400 }}>
            Data user langsung dari backend Laravel
          </p>
        </div>
        <button
          onClick={loadUsers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white transition-all duration-200 disabled:opacity-70"
          style={{ background: "linear-gradient(135deg, #1A3A8F, #1E6CB5)", fontWeight: 500 }}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total User", value: stats.total, icon: UserRound, color: "#1E6CB5", bg: "#EFF6FF" },
          { label: "Admin", value: stats.admin, icon: Shield, color: "#D97706", bg: "#FFFBEB" },
          { label: "Mahasiswa", value: stats.mahasiswa, icon: Hash, color: "#059669", bg: "#ECFDF5" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm" style={{ fontWeight: 500 }}>{stat.label}</p>
                  <p className="text-2xl mt-1" style={{ fontWeight: 700, color: stat.color }}>{stat.value}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: stat.bg }}>
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama, email, atau NIM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            style={{ fontWeight: 400 }}
          />
        </div>

        <div className="flex gap-2">
          {[
            { key: "all", label: "Semua" },
            { key: "admin", label: "Admin" },
            { key: "mahasiswa", label: "Mahasiswa" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                activeTab === tab.key ? "bg-blue-600 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              style={{ fontWeight: 500 }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["User", "Email", "Role", "NIM", "Dibuat"].map((header) => (
                  <th key={header} className="px-6 py-4 text-left text-gray-600 text-xs uppercase tracking-wider" style={{ fontWeight: 600 }}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">Memuat data user...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">Tidak ada user ditemukan</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm text-white" style={{ background: "linear-gradient(135deg, #1A3A8F, #29ABE2)", fontWeight: 700 }}>
                          {initials(user.name)}
                        </div>
                        <div>
                          <p className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{user.name}</p>
                          <p className="text-gray-400 text-xs">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                        <Mail className="w-3.5 h-3.5" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs"
                        style={{
                          background: user.role === "admin" ? "#FFFBEB" : "#ECFDF5",
                          color: user.role === "admin" ? "#D97706" : "#059669",
                          fontWeight: 600,
                        }}
                      >
                        <Shield className="w-3 h-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{user.student?.nim || "-"}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString("id-ID") : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

