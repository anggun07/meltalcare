"use client";

import { useState } from "react";
import { Search, Users, X, ChevronLeft, ChevronRight, Mail, BookOpen, Eye } from "lucide-react";
import { students, Student } from "../shared/mockData";
import { StressBadge } from "../shared/StressBadge";

interface StudentDetailModalProps {
  student: Student;
  onClose: () => void;
}

function StudentDetailModal({ student, onClose }: StudentDetailModalProps) {
  const colorMap = {
    "Tidak Stres": { color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0" },
    "Stres Ringan": { color: "#F59E0B", bg: "#FFFBEB", border: "#FCD34D" },
    "Stres Berat": { color: "#EF4444", bg: "#FEF2F2", border: "#FCA5A5" },
  };
  const colors = colorMap[student.lastStatus];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-gray-800 text-base" style={{ fontWeight: 700 }}>Detail Mahasiswa</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Avatar + Name */}
        <div className="flex flex-col items-center mb-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl text-white mb-3"
            style={{ background: "linear-gradient(135deg, #1A3A8F, #29ABE2)", fontWeight: 800 }}
          >
            {student.avatar}
          </div>
          <h4 className="text-gray-800 text-base" style={{ fontWeight: 700 }}>{student.name}</h4>
          <p className="text-gray-400 text-sm" style={{ fontWeight: 400 }}>{student.nim}</p>
        </div>

        {/* Status Card */}
        <div
          className="rounded-xl p-4 border mb-5 flex items-center justify-between"
          style={{ background: colors.bg, borderColor: colors.border }}
        >
          <span className="text-sm text-gray-600" style={{ fontWeight: 500 }}>Status Terakhir</span>
          <StressBadge category={student.lastStatus} size="sm" />
        </div>

        {/* Details */}
        <div className="space-y-3">
          {[
            { label: "Email", value: student.email, icon: Mail },
            { label: "Total Tes", value: `${student.totalTests} Tes`, icon: BookOpen },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex items-center gap-3 py-2 border-b border-gray-50">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400" style={{ fontWeight: 400 }}>{label}</p>
                <p className="text-sm text-gray-700" style={{ fontWeight: 500 }}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-2.5 rounded-xl text-white text-sm"
          style={{ background: "linear-gradient(135deg, #1A3A8F, #1E6CB5)", fontWeight: 600 }}
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

export function StudentData() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const perPage = 5;

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()) || s.nim.includes(search);
    const matchStatus = filterStatus === "all" || s.lastStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const stats = {
    total: students.length,
    notStres: students.filter((s) => s.lastStatus === "Tidak Stres").length,
    ringan: students.filter((s) => s.lastStatus === "Stres Ringan").length,
    berat: students.filter((s) => s.lastStatus === "Stres Berat").length,
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-gray-800 text-xl" style={{ fontWeight: 700 }}>Data Mahasiswa</h2>
        <p className="text-gray-400 text-sm mt-0.5" style={{ fontWeight: 400 }}>Kelola data dan pantau status mahasiswa</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Mahasiswa", value: stats.total, color: "#1E6CB5", bg: "#EFF6FF", border: "#BFDBFE" },
          { label: "Tidak Stres", value: stats.notStres, color: "#10B981", bg: "#ECFDF5", border: "#A7F3D0" },
          { label: "Stres Ringan", value: stats.ringan, color: "#F59E0B", bg: "#FFFBEB", border: "#FCD34D" },
          { label: "Stres Berat", value: stats.berat, color: "#EF4444", bg: "#FEF2F2", border: "#FCA5A5" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border shadow-sm text-center" style={{ borderColor: s.border }}>
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
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Cari nama, email, atau NIM..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none"
              style={{ fontWeight: 400, background: "#F9FAFB" }}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="py-2 px-3 border border-gray-200 rounded-xl text-sm outline-none bg-gray-50"
            style={{ fontWeight: 400, color: "#374151" }}
          >
            <option value="all">Semua Status</option>
            <option value="Tidak Stres">Tidak Stres</option>
            <option value="Stres Ringan">Stres Ringan</option>
            <option value="Stres Berat">Stres Berat</option>
          </select>
          {(search || filterStatus !== "all") && (
            <button
              onClick={() => { setSearch(""); setFilterStatus("all"); setPage(1); }}
              className="flex items-center gap-1 text-xs px-3 py-2 rounded-lg bg-red-50 text-red-500"
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
                {["#", "Nama Mahasiswa", "Email / NIM", "Total Tes", "Status Terakhir", "Aksi"].map((h) => (
                  <th key={h} className="text-left px-5 py-4 text-xs text-gray-500 uppercase tracking-wide" style={{ fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    <Users className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                    <p className="text-sm" style={{ fontWeight: 500 }}>Tidak ada data mahasiswa</p>
                  </td>
                </tr>
              ) : (
                paginated.map((student, idx) => (
                  <tr key={student.id} className="border-t border-gray-50 hover:bg-blue-50/20 transition-colors">
                    <td className="px-5 py-4 text-sm text-gray-400" style={{ fontWeight: 500 }}>
                      {(page - 1) * perPage + idx + 1}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-xs text-white flex-shrink-0"
                          style={{ background: "linear-gradient(135deg, #1A3A8F, #29ABE2)", fontWeight: 700 }}
                        >
                          {student.avatar}
                        </div>
                        <span className="text-sm text-gray-700" style={{ fontWeight: 600 }}>{student.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-600" style={{ fontWeight: 400 }}>{student.email}</p>
                      <p className="text-xs text-gray-400" style={{ fontWeight: 400 }}>NIM: {student.nim}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm" style={{ fontWeight: 700, color: "#1A3A8F" }}>{student.totalTests}</span>
                        <span className="text-xs text-gray-400">tes</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StressBadge category={student.lastStatus} size="sm" />
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors"
                        style={{ background: "#EFF6FF", color: "#1E6CB5", fontWeight: 500 }}
                      >
                        <Eye className="w-3 h-3" /> Detail
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
              {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} dari {filtered.length} mahasiswa
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4 text-gray-500" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="w-8 h-8 rounded-lg text-xs"
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
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedStudent && <StudentDetailModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />}
    </div>
  );
}

