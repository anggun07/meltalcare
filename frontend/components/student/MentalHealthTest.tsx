"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertTriangle, XCircle, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";
import { mentalHealthQuestions, getStressCategory, StressLevel } from "../shared/mockData";

export function MentalHealthTest() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ score: number; category: StressLevel } | null>(null);

  const totalQ = mentalHealthQuestions.length;
  const progress = ((currentQ) / totalQ) * 100;
  const currentQuestion = mentalHealthQuestions[currentQ];
  const answeredCount = Object.keys(answers).length;

  const handleAnswer = (value: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = () => {
    if (currentQ < totalQ - 1) setCurrentQ((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ((prev) => prev - 1);
  };

  const handleSubmit = () => {
    const total = Object.values(answers).reduce((a, b) => a + b, 0);
    const maxScore = totalQ * 3;
    const score = Math.round((total / maxScore) * 42);
    const category = getStressCategory(score);
    setResult({ score, category });
    setSubmitted(true);
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setAnswers({});
    setSubmitted(false);
    setResult(null);
  };

  if (submitted && result) {
    const config = {
      "Tidak Stres": {
        icon: CheckCircle,
        title: "Tidak Stres",
        desc: "Kondisi mental kamu dalam keadaan baik! Pertahankan pola hidup sehat dan terus jaga keseimbangan akademik.",
        bg: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
        border: "#A7F3D0",
        iconColor: "#10B981",
        textColor: "#065F46",
        badgeBg: "#D1FAE5",
        badgeText: "#065F46",
        tips: ["Pertahankan pola tidur yang teratur", "Lanjutkan aktivitas fisik rutin", "Jaga komunikasi dengan teman dan keluarga"],
      },
      "Stres Ringan": {
        icon: AlertTriangle,
        title: "Stres Ringan",
        desc: "Kamu mengalami sedikit stres. Tidak perlu khawatir, namun perlu perhatian lebih pada keseimbangan aktivitas.",
        bg: "linear-gradient(135deg, #FFFBEB, #FEF3C7)",
        border: "#FCD34D",
        iconColor: "#F59E0B",
        textColor: "#92400E",
        badgeBg: "#FEF3C7",
        badgeText: "#92400E",
        tips: ["Luangkan waktu untuk istirahat", "Cobalah teknik relaksasi atau meditasi", "Bicarakan perasaanmu dengan orang terpercaya"],
      },
      "Stres Berat": {
        icon: XCircle,
        title: "Stres Berat",
        desc: "Tingkat stresmu cukup tinggi. Sangat disarankan untuk segera berkonsultasi dengan konselor atau psikolog.",
        bg: "linear-gradient(135deg, #FEF2F2, #FEE2E2)",
        border: "#FCA5A5",
        iconColor: "#EF4444",
        textColor: "#7F1D1D",
        badgeBg: "#FEE2E2",
        badgeText: "#7F1D1D",
        tips: ["Segera hubungi konselor kampus", "Kurangi beban kerja jika memungkinkan", "Jangan ragu meminta bantuan profesional"],
      },
    }[result.category];

    const Icon = config.icon;

    return (
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-gray-800 text-xl" style={{ fontWeight: 700 }}>Hasil Tes Kesehatan Mental</h2>
          <p className="text-gray-400 text-sm mt-1" style={{ fontWeight: 400 }}>03 Maret 2026</p>
        </div>

        <div
          className="rounded-2xl p-8 border-2 shadow-lg text-center mb-5"
          style={{ background: config.bg, borderColor: config.border }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: config.badgeBg }}
          >
            <Icon className="w-10 h-10" style={{ color: config.iconColor }} />
          </div>

          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm mb-3"
            style={{ background: config.badgeBg, color: config.badgeText, fontWeight: 600 }}
          >
            {config.title}
          </span>

          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-5xl" style={{ fontWeight: 800, color: config.textColor }}>{result.score}</span>
            <span className="text-xl text-gray-400 mt-2" style={{ fontWeight: 400 }}>/42</span>
          </div>
          <p className="text-xs text-gray-500 mb-4" style={{ fontWeight: 400 }}>Skor Total</p>

          <p className="text-sm mb-2" style={{ color: config.textColor, fontWeight: 400, lineHeight: 1.7 }}>
            {config.desc}
          </p>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-5">
          <h3 className="text-gray-800 text-sm mb-3" style={{ fontWeight: 700 }}>Rekomendasi untuk Kamu</h3>
          <ul className="space-y-2">
            {config.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
                  style={{ background: config.badgeBg, color: config.iconColor, fontWeight: 700 }}>
                  {i + 1}
                </span>
                <span className="text-sm text-gray-600" style={{ fontWeight: 400 }}>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleRetry}
            className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm transition-all hover:bg-gray-50"
            style={{ borderColor: "#E5E7EB", color: "#374151", fontWeight: 600 }}
          >
            <RotateCcw className="w-4 h-4" /> Tes Ulang
          </button>
          <button
            onClick={() => router.push("/student/history")}
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm transition-all"
            style={{
              background: "linear-gradient(135deg, #1A3A8F, #1E6CB5)",
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(30,108,181,0.3)",
            }}
          >
            Lihat Riwayat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-gray-800 text-xl mb-1" style={{ fontWeight: 700 }}>Tes Kesehatan Mental</h2>
        <p className="text-gray-400 text-sm" style={{ fontWeight: 400 }}>
          Jawab semua pertanyaan dengan jujur untuk hasil yang akurat.
        </p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600" style={{ fontWeight: 500 }}>
            Pertanyaan {currentQ + 1} dari {totalQ}
          </span>
          <span className="text-sm" style={{ fontWeight: 600, color: "#1E6CB5" }}>
            {answeredCount}/{totalQ} terjawab
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${((currentQ + (answers[currentQuestion.id] !== undefined ? 1 : 0)) / totalQ) * 100}%`,
              background: "linear-gradient(90deg, #1A3A8F, #29ABE2)",
            }}
          />
        </div>

        {/* Question Navigation Dots */}
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {mentalHealthQuestions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQ(idx)}
              className={`w-7 h-7 rounded-lg text-xs transition-all ${
                idx === currentQ
                  ? "text-white shadow-md"
                  : answers[q.id] !== undefined
                  ? "text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
              style={{
                background: idx === currentQ
                  ? "linear-gradient(135deg, #1A3A8F, #29ABE2)"
                  : answers[q.id] !== undefined
                  ? "#10B981"
                  : undefined,
                fontWeight: 600,
              }}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-4 overflow-hidden">
        {/* Question Header */}
        <div className="p-5 border-b border-gray-50" style={{ background: "linear-gradient(135deg, #EFF6FF, #EEF2FF)" }}>
          <div className="flex items-start gap-3">
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #1A3A8F, #1E6CB5)", fontWeight: 700 }}
            >
              {currentQ + 1}
            </span>
            <p className="text-gray-800 text-base" style={{ fontWeight: 600, lineHeight: 1.6 }}>
              {currentQuestion.question}
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="p-5 space-y-3">
          {currentQuestion.options.map((option) => {
            const selected = answers[currentQuestion.id] === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  selected
                    ? "shadow-md"
                    : "border-gray-100 hover:border-blue-200 hover:bg-blue-50/30"
                }`}
                style={{
                  borderColor: selected ? "#1E6CB5" : undefined,
                  background: selected ? "linear-gradient(135deg, #EFF6FF, #EEF2FF)" : undefined,
                }}
              >
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    selected ? "border-blue-600" : "border-gray-300"
                  }`}
                >
                  {selected && (
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#1E6CB5" }} />
                  )}
                </span>
                <span
                  className="text-sm"
                  style={{
                    fontWeight: selected ? 600 : 400,
                    color: selected ? "#1A3A8F" : "#374151",
                  }}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePrev}
          disabled={currentQ === 0}
          className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
          style={{ borderColor: "#E5E7EB", color: "#374151", fontWeight: 600 }}
        >
          <ChevronLeft className="w-4 h-4" /> Sebelumnya
        </button>

        <div className="flex-1" />

        {currentQ === totalQ - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={answeredCount < totalQ}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #1A3A8F, #1E6CB5)",
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(30,108,181,0.3)",
            }}
          >
            <CheckCircle className="w-4 h-4" />
            Kirim Hasil
            {answeredCount < totalQ && (
              <span className="text-xs opacity-70">({totalQ - answeredCount} belum)</span>
            )}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm transition-all"
            style={{
              background: "linear-gradient(135deg, #1A3A8F, #1E6CB5)",
              fontWeight: 600,
              boxShadow: "0 4px 14px rgba(30,108,181,0.3)",
            }}
          >
            Selanjutnya <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}


