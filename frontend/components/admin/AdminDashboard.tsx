"use client";

import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import {
  Users, CheckCircle, AlertTriangle, XCircle, TrendingUp, ArrowRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { StressBadge } from "../shared/StressBadge";
import { apiRequest } from "@/lib/api";
import { DashboardData, toTestRecord } from "@/lib/mental-health";

const RADIAN = Math.PI / 180;
const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function AdminDashboard() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await apiRequest<{ data: DashboardData }>("/admin/dashboard");
        setDashboard(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal mengambil data dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const colors: Record<string, string> = {
    "Tidak Stres": "#10B981",
    "Stres Ringan": "#F59E0B",
    "Stres Berat": "#EF4444",
  };
  const stressDistribution = (dashboard?.distribution || []).map((item) => ({
    name: item.category,
    value: item.percentage,
    count: item.count,
    color: colors[item.category],
  }));
  const monthlyTrendData = (dashboard?.monthly_trend || []).map((item) => ({
    month: item.month,
    tidakStres: item.tidak_stres,
    stresRingan: item.stres_ringan,
    stresBerat: item.stres_berat,
  }));
  const testHistory = (dashboard?.recent_tests || []).map(toTestRecord);
  const distributionByCategory = Object.fromEntries((dashboard?.distribution || []).map((item) => [item.category, item]));

  const statCards = [
    {
      label: "Total Mahasiswa",
      value: String(dashboard?.total_students || 0),
      sub: "Akun mahasiswa terdaftar",
      icon: Users,
      color: "#1E6CB5",
      bg: "#EFF6FF",
      border: "#BFDBFE",
    },
    {
      label: "Tidak Stres",
      value: `${distributionByCategory["Tidak Stres"]?.percentage || 0}%`,
      sub: `${distributionByCategory["Tidak Stres"]?.count || 0} mahasiswa`,
      icon: CheckCircle,
      color: "#10B981",
      bg: "#ECFDF5",
      border: "#A7F3D0",
    },
    {
      label: "Stres Ringan",
      value: `${distributionByCategory["Stres Ringan"]?.percentage || 0}%`,
      sub: `${distributionByCategory["Stres Ringan"]?.count || 0} mahasiswa`,
      icon: AlertTriangle,
      color: "#F59E0B",
      bg: "#FFFBEB",
      border: "#FCD34D",
    },
    {
      label: "Stres Berat",
      value: `${distributionByCategory["Stres Berat"]?.percentage || 0}%`,
      sub: `${distributionByCategory["Stres Berat"]?.count || 0} mahasiswa`,
      icon: XCircle,
      color: "#EF4444",
      bg: "#FEF2F2",
      border: "#FCA5A5",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0F2461 0%, #1A3A8F 50%, #1E6CB5 100%)" }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 bg-white translate-x-20 -translate-y-20" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-blue-300 text-sm mb-1" style={{ fontWeight: 400 }}>Panel Administrator</p>
            <h1 className="text-white text-xl mb-2" style={{ fontWeight: 700 }}>Selamat datang, Admin!</h1>
            <p className="text-blue-100 text-sm" style={{ fontWeight: 400 }}>
              Pantau kondisi kesehatan mental mahasiswa secara real-time.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-3xl text-white" style={{ fontWeight: 800 }}>{dashboard?.total_students || 0}</p>
              <p className="text-blue-200 text-xs" style={{ fontWeight: 400 }}>Mahasiswa</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-3xl text-white" style={{ fontWeight: 800 }}>{dashboard?.tests_this_month || 0}</p>
              <p className="text-blue-200 text-xs" style={{ fontWeight: 400 }}>Tes Bulan Ini</p>
            </div>
            <div className="w-px bg-white/20" />
            <div className="text-center">
              <p className="text-3xl text-white" style={{ fontWeight: 800 }}>{dashboard?.total_tests || 0}</p>
              <p className="text-blue-200 text-xs" style={{ fontWeight: 400 }}>Total Tes</p>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}
      {loading && <div className="px-4 py-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-sm">Memuat data dashboard...</div>}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-shadow"
              style={{ borderColor: card.border }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.bg }}>
                  <Icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-200" />
              </div>
              <p className="text-2xl mb-1" style={{ fontWeight: 800, color: card.color }}>{card.value}</p>
              <p className="text-sm text-gray-600 mb-0.5" style={{ fontWeight: 500 }}>{card.label}</p>
              <p className="text-xs text-gray-400" style={{ fontWeight: 400 }}>{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Pie Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-gray-800 text-base mb-1" style={{ fontWeight: 700 }}>Distribusi Tingkat Stres</h3>
          <p className="text-gray-400 text-xs mb-5" style={{ fontWeight: 400 }}>Bulan Maret 2026</p>

          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stressDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomPieLabel}
                outerRadius={90}
                innerRadius={40}
                dataKey="value"
              >
                {stressDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="space-y-2 mt-2">
            {stressDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-xs text-gray-600" style={{ fontWeight: 400 }}>{item.name}</span>
                </div>
                <span className="text-xs" style={{ fontWeight: 700, color: item.color }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Line Chart - Trend */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-gray-800 text-base mb-1" style={{ fontWeight: 700 }}>Tren Stres per Bulan</h3>
          <p className="text-gray-400 text-xs mb-5" style={{ fontWeight: 400 }}>Sep 2025 — Mar 2026</p>

          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={monthlyTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend
                wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
                formatter={(value) =>
                  value === "tidakStres" ? "Tidak Stres"
                  : value === "stresRingan" ? "Stres Ringan"
                  : "Stres Berat"
                }
              />
              <Line type="monotone" dataKey="tidakStres" stroke="#10B981" strokeWidth={2.5}
                dot={{ fill: "#10B981", r: 3, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 5 }} name="tidakStres" />
              <Line type="monotone" dataKey="stresRingan" stroke="#F59E0B" strokeWidth={2.5}
                dot={{ fill: "#F59E0B", r: 3, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 5 }} name="stresRingan" />
              <Line type="monotone" dataKey="stresBerat" stroke="#EF4444" strokeWidth={2.5}
                dot={{ fill: "#EF4444", r: 3, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 5 }} name="stresBerat" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-50">
          <div>
            <h3 className="text-gray-800 text-base" style={{ fontWeight: 700 }}>Aktivitas Tes Terbaru</h3>
            <p className="text-gray-400 text-xs mt-0.5" style={{ fontWeight: 400 }}>Semua hasil tes mahasiswa</p>
          </div>
          <button
            onClick={() => router.push("/admin/history")}
            className="text-sm flex items-center gap-1 hover:underline"
            style={{ color: "#1E6CB5", fontWeight: 500 }}
          >
            Lihat semua <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {["Mahasiswa", "Tanggal Tes", "Skor", "Kategori", "NIM"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {testHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">Belum ada hasil tes mahasiswa.</td>
                </tr>
              ) : testHistory.slice(0, 6).map((record, idx) => (
                <tr key={record.id} className={`border-t border-gray-50 hover:bg-blue-50/20 transition-colors ${idx % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs text-white flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #1A3A8F, #29ABE2)", fontWeight: 700 }}
                      >
                        {record.studentName?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="text-sm text-gray-700" style={{ fontWeight: 500 }}>{record.studentName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-gray-600" style={{ fontWeight: 400 }}>
                      {new Date(record.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm" style={{ fontWeight: 700, color: "#1A3A8F" }}>{record.score}</span>
                    <span className="text-xs text-gray-400 ml-1">/42</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StressBadge category={record.category} size="sm" />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-gray-600" style={{ fontWeight: 500 }}>{record.nim || "-"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

