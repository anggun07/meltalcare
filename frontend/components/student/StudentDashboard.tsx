"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { Activity, Brain, CheckCircle, TrendingUp, Clock, ArrowRight, X } from "lucide-react";
import { heartRateData } from "../shared/mockData";
import { StressBadge } from "../shared/StressBadge";
import { getCurrentUser, CurrentUser } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import { MentalHealthTestApi, TestRecord, toTestRecord } from "@/lib/mental-health";

function formatTestDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-blue-100 rounded-xl p-3 shadow-lg">
        <p className="text-xs text-gray-500 mb-1" style={{ fontWeight: 500 }}>{label}</p>
        <p className="text-sm" style={{ fontWeight: 700, color: "#1E6CB5" }}>
          {payload[0].value} BPM
        </p>
      </div>
    );
  }
  return null;
};

export function StudentDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [testHistory, setTestHistory] = useState<TestRecord[]>([]);
  const [testsLoading, setTestsLoading] = useState(true);
  const [testsError, setTestsError] = useState("");
  const [selectedTest, setSelectedTest] = useState<TestRecord | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    const loadTests = async () => {
      const studentId = user?.student?.id;

      if (!studentId) {
        setTestsError("Data mahasiswa tidak ditemukan. Silakan login ulang.");
        setTestsLoading(false);
        return;
      }

      try {
        const response = await apiRequest<{ data: MentalHealthTestApi[] }>(
          `/students/${studentId}/mental-health-tests`,
        );
        setTestHistory(response.data.map(toTestRecord));
      } catch (error) {
        setTestsError(error instanceof Error ? error.message : "Gagal mengambil riwayat tes.");
      } finally {
        setTestsLoading(false);
      }
    };

    loadTests();
  }, []);

  const latestTest = testHistory[0];
  const now = new Date();
  const testsThisMonth = testHistory.filter((test) => {
    const testedAt = new Date(test.date);
    return testedAt.getMonth() === now.getMonth() && testedAt.getFullYear() === now.getFullYear();
  }).length;

  const latestStatusStyle = latestTest?.category === "Stres Berat"
    ? { color: "#EF4444", bg: "#FEF2F2", border: "#FCA5A5" }
    : latestTest?.category === "Stres Ringan"
      ? { color: "#F59E0B", bg: "#FFFBEB", border: "#FCD34D" }
      : latestTest
        ? { color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0" }
        : { color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB" };

  const summaryCards = [
    {
      label: "Status Terakhir",
      value: testsLoading ? "Memuat..." : latestTest?.category || "Belum Ada Tes",
      sub: latestTest ? `Tes terakhir: ${formatTestDate(latestTest.date)}` : "Belum ada hasil tes tersimpan",
      icon: CheckCircle,
      ...latestStatusStyle,
    },
    {
      label: "Total Tes Dilakukan",
      value: testsLoading ? "-" : String(testHistory.length),
      sub: `${testsThisMonth} tes bulan ini`,
      icon: Brain,
      color: "#1E6CB5",
      bg: "#EFF6FF",
      border: "#BFDBFE",
    },
    {
      label: "Rata-rata Detak Jantung",
      value: "79 BPM",
      sub: "Normal (60–100 BPM)",
      icon: Activity,
      color: "#1A3A8F",
      bg: "#EEF2FF",
      border: "#C7D2FE",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1A3A8F 0%, #1E6CB5 60%, #29ABE2 100%)" }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10 bg-white translate-x-16 -translate-y-16" />
        <div className="absolute bottom-0 right-20 w-24 h-24 rounded-full opacity-10 bg-white translate-y-12" />
        <div className="relative z-10">
          <p className="text-blue-200 text-sm mb-1" style={{ fontWeight: 400 }}>Selamat datang kembali 👋</p>
          <h1 className="text-white text-xl mb-2" style={{ fontWeight: 700 }}>{currentUser?.name || "Mahasiswa"}</h1>
          <p className="text-blue-100 text-sm mb-4" style={{ fontWeight: 400 }}>
            Pantau kondisi kesehatan mental kamu secara rutin untuk performa akademik yang optimal.
          </p>
          <button
            onClick={() => router.push("/student/test")}
            className="flex items-center gap-2 bg-white rounded-xl px-4 py-2 text-sm transition-all hover:shadow-lg"
            style={{ fontWeight: 600, color: "#1A3A8F" }}
          >
            Mulai Tes Sekarang <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {testsError && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {testsError}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-shadow duration-200"
              style={{ borderColor: card.border }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.bg }}>
                  <Icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-300" />
              </div>
              <p className="text-2xl mb-1" style={{ fontWeight: 700, color: card.color }}>{card.value}</p>
              <p className="text-sm text-gray-600 mb-1" style={{ fontWeight: 500 }}>{card.label}</p>
              <p className="text-xs text-gray-400" style={{ fontWeight: 400 }}>{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Heart Rate Chart */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-gray-800 text-base" style={{ fontWeight: 700 }}>Riwayat Detak Jantung</h3>
            <p className="text-gray-400 text-xs mt-0.5" style={{ fontWeight: 400 }}>Hari ini — 03 Maret 2026</p>
          </div>
          <button
            onClick={() => router.push("/student/heartrate")}
            className="text-sm flex items-center gap-1 hover:underline"
            style={{ color: "#1E6CB5", fontWeight: 500 }}
          >
            Lihat semua <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* BPM Zone Legend */}
        <div className="flex flex-wrap gap-3 mb-4">
          {[
            { color: "#10B981", label: "Normal (60–80)" },
            { color: "#F59E0B", label: "Waspada (80–100)" },
            { color: "#EF4444", label: "Tinggi (>100)" },
          ].map((z) => (
            <div key={z.label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: z.color }} />
              <span className="text-xs text-gray-500" style={{ fontWeight: 400 }}>{z.label}</span>
            </div>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={heartRateData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="bpmGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E6CB5" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#1E6CB5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <YAxis domain={[55, 110]} tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine key="ref-80" y={80} stroke="#F59E0B" strokeDasharray="4 4" strokeWidth={1.5} />
            <ReferenceLine key="ref-100" y={100} stroke="#EF4444" strokeDasharray="4 4" strokeWidth={1.5} />
            <Line
              type="monotone"
              dataKey="bpm"
              stroke="#1E6CB5"
              strokeWidth={2.5}
              dot={{ fill: "#1E6CB5", r: 3, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 5, fill: "#1A3A8F" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Tests Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-50">
          <div>
            <h3 className="text-gray-800 text-base" style={{ fontWeight: 700 }}>Riwayat Tes Terbaru</h3>
            <p className="text-gray-400 text-xs mt-0.5" style={{ fontWeight: 400 }}>
              {testsLoading ? "Memuat data..." : `${Math.min(testHistory.length, 5)} tes terakhir`}
            </p>
          </div>
          <button
            onClick={() => router.push("/student/history")}
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
                <th className="text-left px-5 py-3 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>Tanggal</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>Skor</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>Kategori</th>
                <th className="text-left px-5 py-3 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>Detail</th>
              </tr>
            </thead>
            <tbody>
              {!testsLoading && testHistory.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-400">
                    Belum ada riwayat tes kesehatan mental.
                  </td>
                </tr>
              )}
              {testHistory.slice(0, 5).map((test, idx) => (
                <tr key={test.id} className={`border-t border-gray-50 hover:bg-blue-50/30 transition-colors ${idx % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-gray-300" />
                      <span className="text-sm text-gray-700" style={{ fontWeight: 500 }}>
                        {formatTestDate(test.date)}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm" style={{ fontWeight: 700, color: "#1A3A8F" }}>{test.score}</span>
                    <span className="text-xs text-gray-400 ml-1" style={{ fontWeight: 400 }}>/{test.maxScore}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <StressBadge category={test.category} size="sm" />
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => setSelectedTest(test)}
                      className="text-xs px-3 py-1 rounded-lg transition-colors"
                      style={{ background: "#EFF6FF", color: "#1E6CB5", fontWeight: 500 }}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTest && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedTest(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-800">Detail Hasil Tes</h3>
              <button
                onClick={() => setSelectedTest(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200"
                aria-label="Tutup detail"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>

            <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 p-5 text-center">
              <p className="text-4xl font-extrabold text-blue-800">{selectedTest.score}</p>
              <p className="mb-3 text-xs text-gray-500">Skor total /{selectedTest.maxScore}</p>
              <StressBadge category={selectedTest.category} />
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-gray-100 py-2">
                <span className="text-gray-500">Tanggal Tes</span>
                <span className="font-semibold text-gray-800">{formatTestDate(selectedTest.date)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 py-2">
                <span className="text-gray-500">Kategori</span>
                <span className="font-semibold text-gray-800">{selectedTest.category}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-500">Persentase Skor</span>
                <span className="font-semibold text-blue-800">
                  {Math.round((selectedTest.score / selectedTest.maxScore) * 100)}%
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedTest(null)}
              className="mt-5 w-full rounded-xl bg-blue-700 py-2.5 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

