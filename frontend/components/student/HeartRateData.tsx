"use client";

import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Area, AreaChart,
} from "recharts";
import { Heart, Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { heartRateData } from "../shared/mockData";

const weeklyData = [
  { day: "Senin", avg: 74, min: 62, max: 98 },
  { day: "Selasa", avg: 79, min: 65, max: 112 },
  { day: "Rabu", avg: 71, min: 60, max: 90 },
  { day: "Kamis", avg: 82, min: 68, max: 105 },
  { day: "Jumat", avg: 76, min: 63, max: 95 },
  { day: "Sabtu", avg: 68, min: 58, max: 82 },
  { day: "Minggu", avg: 66, min: 57, max: 79 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const bpm = payload[0]?.value;
    const zone = bpm <= 80 ? { label: "Normal", color: "#10B981" }
      : bpm <= 100 ? { label: "Waspada", color: "#F59E0B" }
      : { label: "Tinggi", color: "#EF4444" };
    return (
      <div className="bg-white border border-blue-100 rounded-xl p-3 shadow-lg min-w-32">
        <p className="text-xs text-gray-500 mb-2" style={{ fontWeight: 500 }}>{label}</p>
        <p className="text-lg" style={{ fontWeight: 800, color: "#1A3A8F" }}>{bpm} <span className="text-xs text-gray-400" style={{ fontWeight: 400 }}>BPM</span></p>
        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${zone.color}20`, color: zone.color, fontWeight: 600 }}>
          {zone.label}
        </span>
      </div>
    );
  }
  return null;
};

export function HeartRateData() {
  const [view, setView] = useState<"daily" | "weekly">("daily");

  const currentBPM = 72;
  const avgBPM = Math.round(heartRateData.reduce((a, b) => a + b.bpm, 0) / heartRateData.length);
  const maxBPM = Math.max(...heartRateData.map((d) => d.bpm));
  const minBPM = Math.min(...heartRateData.map((d) => d.bpm));

  const getZone = (bpm: number) => {
    if (bpm <= 60) return { label: "Terlalu Rendah", color: "#3B82F6", bg: "#EFF6FF" };
    if (bpm <= 80) return { label: "Normal", color: "#10B981", bg: "#ECFDF5" };
    if (bpm <= 100) return { label: "Waspada", color: "#F59E0B", bg: "#FFFBEB" };
    return { label: "Tinggi", color: "#EF4444", bg: "#FEF2F2" };
  };

  const zone = getZone(currentBPM);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-gray-800 text-xl" style={{ fontWeight: 700 }}>Data Detak Jantung</h2>
        <p className="text-gray-400 text-sm mt-0.5" style={{ fontWeight: 400 }}>Monitoring real-time dari sensor IoT</p>
      </div>

      {/* Live BPM Card */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1A3A8F 0%, #1E6CB5 60%, #29ABE2 100%)" }}
      >
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 bg-white translate-x-20 -translate-y-20" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
              <Heart className="w-8 h-8 text-red-300" fill="#FCA5A5" />
            </div>
            <div>
              <p className="text-blue-200 text-sm mb-0.5" style={{ fontWeight: 400 }}>Detak Jantung Terkini</p>
              <div className="flex items-end gap-2">
                <span className="text-5xl" style={{ fontWeight: 800 }}>{currentBPM}</span>
                <span className="text-2xl text-blue-200 mb-1" style={{ fontWeight: 400 }}>BPM</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <span
              className="px-3 py-1.5 rounded-xl text-sm"
              style={{ background: zone.bg, color: zone.color, fontWeight: 700 }}
            >
              {zone.label}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-blue-200 text-xs" style={{ fontWeight: 400 }}>Sensor Aktif — 15:42:10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Rata-rata", value: avgBPM, icon: Activity, color: "#1E6CB5", bg: "#EFF6FF", border: "#BFDBFE", trend: <Minus className="w-3 h-3" /> },
          { label: "Tertinggi", value: maxBPM, icon: TrendingUp, color: "#EF4444", bg: "#FEF2F2", border: "#FCA5A5", trend: <TrendingUp className="w-3 h-3" /> },
          { label: "Terendah", value: minBPM, icon: TrendingDown, color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0", trend: <TrendingDown className="w-3 h-3" /> },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl p-4 border shadow-sm" style={{ borderColor: s.border }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: s.bg }}>
                <Icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <p className="text-xl" style={{ fontWeight: 800, color: s.color }}>{s.value} <span className="text-xs text-gray-400" style={{ fontWeight: 400 }}>BPM</span></p>
              <p className="text-xs text-gray-500 mt-0.5" style={{ fontWeight: 500 }}>{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        {/* View Toggle */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-gray-800 text-base" style={{ fontWeight: 700 }}>Grafik Detak Jantung</h3>
            <p className="text-gray-400 text-xs mt-0.5" style={{ fontWeight: 400 }}>
              {view === "daily" ? "Hari ini — 03 Maret 2026" : "Minggu ini"}
            </p>
          </div>
          <div className="flex p-1 bg-gray-100 rounded-xl">
            {["daily", "weekly"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v as any)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                  view === v ? "bg-white shadow-sm text-blue-700" : "text-gray-500"
                }`}
                style={{ fontWeight: view === v ? 600 : 400 }}
              >
                {v === "daily" ? "Harian" : "Mingguan"}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-4">
          {[
            { color: "#10B981", label: "Normal (≤80 BPM)" },
            { color: "#F59E0B", label: "Waspada (80–100)" },
            { color: "#EF4444", label: "Tinggi (>100 BPM)" },
          ].map((z) => (
            <div key={z.label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: z.color }} />
              <span className="text-xs text-gray-500" style={{ fontWeight: 400 }}>{z.label}</span>
            </div>
          ))}
        </div>

        {view === "daily" ? (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={heartRateData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="bpmArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E6CB5" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#1E6CB5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis domain={[55, 115]} tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={80} stroke="#F59E0B" strokeDasharray="4 4" strokeWidth={1.5} />
              <ReferenceLine y={100} stroke="#EF4444" strokeDasharray="4 4" strokeWidth={1.5} />
              <Area type="monotone" dataKey="bpm" stroke="#1E6CB5" strokeWidth={2.5} fill="url(#bpmArea)"
                dot={{ fill: "#1E6CB5", r: 3, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 5, fill: "#1A3A8F" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis domain={[50, 120]} tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <ReferenceLine y={80} stroke="#F59E0B" strokeDasharray="4 4" strokeWidth={1.5} />
              <ReferenceLine y={100} stroke="#EF4444" strokeDasharray="4 4" strokeWidth={1.5} />
              <Line type="monotone" dataKey="max" stroke="#EF4444" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Maks" />
              <Line type="monotone" dataKey="avg" stroke="#1E6CB5" strokeWidth={2.5}
                dot={{ fill: "#1E6CB5", r: 3, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 5 }} name="Rata-rata"
              />
              <Line type="monotone" dataKey="min" stroke="#10B981" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Min" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* BPM Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50">
          <h3 className="text-gray-800 text-base" style={{ fontWeight: 700 }}>Detail Pengukuran Hari Ini</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-5 py-3 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>Waktu</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>BPM</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>Status</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>Indikator</th>
              </tr>
            </thead>
            <tbody>
              {heartRateData.map((record, idx) => {
                const z = getZone(record.bpm);
                return (
                  <tr key={idx} className="border-t border-gray-50 hover:bg-blue-50/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-gray-700" style={{ fontWeight: 500 }}>{record.time}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm" style={{ fontWeight: 700, color: z.color }}>{record.bpm}</span>
                      <span className="text-xs text-gray-400 ml-1" style={{ fontWeight: 400 }}>BPM</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: z.bg, color: z.color, fontWeight: 600 }}>
                        {z.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="w-24 bg-gray-100 rounded-full h-1.5">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.min(100, (record.bpm / 130) * 100)}%`, background: z.color }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

