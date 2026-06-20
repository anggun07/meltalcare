"use client";

import { useEffect, useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, X, Clock, TrendingUp, BarChart2 } from "lucide-react";
import { StressBadge } from "../shared/StressBadge";
import { apiRequest } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { MentalHealthTestApi, TestRecord, toTestRecord } from "@/lib/mental-health";

interface DetailModalProps {
  test: TestRecord;
  onClose: () => void;
}

function DetailModal({ test, onClose }: DetailModalProps) {
  const colorMap = {
    "Tidak Stres": { color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0" },
    "Stres Ringan": { color: "#F59E0B", bg: "#FFFBEB", border: "#FCD34D" },
    "Stres Berat": { color: "#EF4444", bg: "#FEF2F2", border: "#FCA5A5" },
  };
  const colors = colorMap[test.category];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-gray-800 text-base" style={{ fontWeight: 700 }}>Detail Hasil Tes</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div
          className="rounded-xl p-5 text-center mb-5 border"
          style={{ background: colors.bg, borderColor: colors.border }}
        >
          <div className="text-4xl mb-2" style={{ fontWeight: 800, color: colors.color }}>{test.score}</div>
          <div className="text-xs text-gray-500 mb-3" style={{ fontWeight: 400 }}>Skor Total (/42)</div>
          <StressBadge category={test.category} />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-sm text-gray-500" style={{ fontWeight: 400 }}>Tanggal Tes</span>
            <span className="text-sm text-gray-800" style={{ fontWeight: 600 }}>
              {new Date(test.date).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-sm text-gray-500" style={{ fontWeight: 400 }}>Jumlah Pertanyaan</span>
            <span className="text-sm text-gray-800" style={{ fontWeight: 600 }}>10 Pertanyaan</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-sm text-gray-500" style={{ fontWeight: 400 }}>Skor Maksimal</span>
            <span className="text-sm text-gray-800" style={{ fontWeight: 600 }}>42</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-500" style={{ fontWeight: 400 }}>Persentase</span>
            <span className="text-sm" style={{ fontWeight: 700, color: colors.color }}>
              {Math.round((test.score / 42) * 100)}%
            </span>
          </div>
        </div>

        {/* Score Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(test.score / 42) * 100}%`, background: colors.color }}
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-2.5 rounded-xl text-white text-sm transition-all"
          style={{ background: "linear-gradient(135deg, #1A3A8F, #1E6CB5)", fontWeight: 600 }}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

export function TestHistory() {
  const [studentTestHistory, setStudentTestHistory] = useState<TestRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterDate, setFilterDate] = useState("");
  const [page, setPage] = useState(1);
  const [selectedTest, setSelectedTest] = useState<TestRecord | null>(null);
  const perPage = 5;

  useEffect(() => {
    const loadHistory = async () => {
      const studentId = getCurrentUser()?.student?.id;
      if (!studentId) {
        setError("Data mahasiswa tidak ditemukan. Silakan login ulang.");
        setLoading(false);
        return;
      }

      try {
        const response = await apiRequest<{ data: MentalHealthTestApi[] }>(`/students/${studentId}/mental-health-tests`);
        setStudentTestHistory(response.data.map(toTestRecord));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal mengambil riwayat tes.");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const filtered = studentTestHistory.filter((t) => {
    const matchCategory = filterCategory === "all" || t.category === filterCategory;
    const matchDate = !filterDate || t.date.includes(filterDate);
    return matchCategory && matchDate;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const stats = {
    total: studentTestHistory.length,
    notStres: studentTestHistory.filter((t) => t.category === "Tidak Stres").length,
    ringan: studentTestHistory.filter((t) => t.category === "Stres Ringan").length,
    berat: studentTestHistory.filter((t) => t.category === "Stres Berat").length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-gray-800 text-xl" style={{ fontWeight: 700 }}>Riwayat Tes</h2>
        <p className="text-gray-400 text-sm mt-0.5" style={{ fontWeight: 400 }}>Semua hasil tes kesehatan mental kamu</p>
      </div>

      {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}

      {/* Mini Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Tes", value: stats.total, color: "#1E6CB5", bg: "#EFF6FF" },
          { label: "Tidak Stres", value: stats.notStres, color: "#10B981", bg: "#ECFDF5" },
          { label: "Stres Ringan", value: stats.ringan, color: "#F59E0B", bg: "#FFFBEB" },
          { label: "Stres Berat", value: stats.berat, color: "#EF4444", bg: "#FEF2F2" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <p className="text-2xl mb-0.5" style={{ fontWeight: 800, color: s.color }}>{s.value}</p>
            <p className="text-xs text-gray-500" style={{ fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none"
              style={{ fontWeight: 400, background: "#F9FAFB" }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
              className="py-2 px-3 border border-gray-200 rounded-xl text-sm outline-none bg-gray-50"
              style={{ fontWeight: 400, color: "#374151" }}
            >
              <option value="all">Semua Kategori</option>
              <option value="Tidak Stres">Tidak Stres</option>
              <option value="Stres Ringan">Stres Ringan</option>
              <option value="Stres Berat">Stres Berat</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="month"
              value={filterDate}
              onChange={(e) => { setFilterDate(e.target.value); setPage(1); }}
              className="py-2 px-3 border border-gray-200 rounded-xl text-sm outline-none bg-gray-50"
              style={{ fontWeight: 400, color: "#374151" }}
            />
          </div>

          {(filterCategory !== "all" || filterDate) && (
            <button
              onClick={() => { setFilterCategory("all"); setFilterDate(""); setPage(1); }}
              className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
              style={{ fontWeight: 500 }}
            >
              <X className="w-3 h-3" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "linear-gradient(135deg, #EFF6FF, #EEF2FF)" }}>
                <th className="text-left px-5 py-4 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>#</th>
                <th className="text-left px-5 py-4 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>Tanggal Tes</th>
                <th className="text-left px-5 py-4 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>Skor</th>
                <th className="text-left px-5 py-4 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>Kategori</th>
                <th className="text-left px-5 py-4 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">Memuat riwayat tes...</td>
                </tr>
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">
                    <BarChart2 className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                    <p className="text-sm" style={{ fontWeight: 500 }}>Tidak ada data</p>
                  </td>
                </tr>
              ) : (
                paginated.map((test, idx) => (
                  <tr key={test.id} className="border-t border-gray-50 hover:bg-blue-50/20 transition-colors">
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-400" style={{ fontWeight: 500 }}>
                        {(page - 1) * perPage + idx + 1}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-gray-300" />
                        <span className="text-sm text-gray-700" style={{ fontWeight: 500 }}>
                          {new Date(test.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm" style={{ fontWeight: 700, color: "#1A3A8F" }}>{test.score}</span>
                        <span className="text-xs text-gray-400">/42</span>
                        <div className="ml-2 w-16 bg-gray-100 rounded-full h-1.5">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(test.score / 42) * 100}%`,
                              background: test.category === "Tidak Stres" ? "#10B981" : test.category === "Stres Ringan" ? "#F59E0B" : "#EF4444",
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StressBadge category={test.category} size="sm" />
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedTest(test)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
                        style={{ background: "#EFF6FF", color: "#1E6CB5", fontWeight: 500 }}
                      >
                        <TrendingUp className="w-3 h-3" /> Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50">
            <p className="text-xs text-gray-400" style={{ fontWeight: 400 }}>
              Menampilkan {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} dari {filtered.length} data
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="w-8 h-8 rounded-lg text-xs transition-colors"
                  style={{
                    background: p === page ? "linear-gradient(135deg, #1A3A8F, #1E6CB5)" : undefined,
                    color: p === page ? "white" : "#6B7280",
                    fontWeight: p === page ? 700 : 400,
                    border: p !== page ? "1px solid #E5E7EB" : undefined,
                  }}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedTest && <DetailModal test={selectedTest} onClose={() => setSelectedTest(null)} />}
    </div>
  );
}

