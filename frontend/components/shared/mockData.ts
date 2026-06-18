export type StressLevel = "Tidak Stres" | "Stres Ringan" | "Stres Berat";

export interface TestRecord {
  id: number;
  date: string;
  score: number;
  category: StressLevel;
  studentName?: string;
  studentId?: number;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  nim: string;
  totalTests: number;
  lastStatus: StressLevel;
  avatar: string;
}

export interface HeartRateRecord {
  time: string;
  bpm: number;
  date: string;
}

export interface IoTRecord {
  id: number;
  studentName: string;
  nim: string;
  bpm: number;
  timestamp: string;
  status: StressLevel;
}

export const students: Student[] = [
  { id: 1, name: "Ahmad Fauzi", email: "ahmad.fauzi@student.ac.id", nim: "20210001", totalTests: 12, lastStatus: "Tidak Stres", avatar: "AF" },
  { id: 2, name: "Budi Santoso", email: "budi.santoso@student.ac.id", nim: "20210002", totalTests: 8, lastStatus: "Stres Ringan", avatar: "BS" },
  { id: 3, name: "Citra Dewi", email: "citra.dewi@student.ac.id", nim: "20210003", totalTests: 15, lastStatus: "Stres Berat", avatar: "CD" },
  { id: 4, name: "Dian Pratama", email: "dian.pratama@student.ac.id", nim: "20210004", totalTests: 6, lastStatus: "Tidak Stres", avatar: "DP" },
  { id: 5, name: "Eka Putri", email: "eka.putri@student.ac.id", nim: "20210005", totalTests: 10, lastStatus: "Stres Ringan", avatar: "EP" },
  { id: 6, name: "Fajar Nugroho", email: "fajar.nugroho@student.ac.id", nim: "20210006", totalTests: 4, lastStatus: "Tidak Stres", avatar: "FN" },
  { id: 7, name: "Gita Sari", email: "gita.sari@student.ac.id", nim: "20210007", totalTests: 9, lastStatus: "Stres Ringan", avatar: "GS" },
  { id: 8, name: "Hendra Wijaya", email: "hendra.wijaya@student.ac.id", nim: "20210008", totalTests: 11, lastStatus: "Stres Berat", avatar: "HW" },
];

export const testHistory: TestRecord[] = [
  { id: 1, date: "2026-03-01", score: 18, category: "Tidak Stres", studentName: "Ahmad Fauzi", studentId: 1 },
  { id: 2, date: "2026-02-28", score: 28, category: "Stres Ringan", studentName: "Budi Santoso", studentId: 2 },
  { id: 3, date: "2026-02-27", score: 42, category: "Stres Berat", studentName: "Citra Dewi", studentId: 3 },
  { id: 4, date: "2026-02-25", score: 15, category: "Tidak Stres", studentName: "Dian Pratama", studentId: 4 },
  { id: 5, date: "2026-02-24", score: 31, category: "Stres Ringan", studentName: "Eka Putri", studentId: 5 },
  { id: 6, date: "2026-02-22", score: 12, category: "Tidak Stres", studentName: "Ahmad Fauzi", studentId: 1 },
  { id: 7, date: "2026-02-20", score: 38, category: "Stres Berat", studentName: "Hendra Wijaya", studentId: 8 },
  { id: 8, date: "2026-02-18", score: 25, category: "Stres Ringan", studentName: "Gita Sari", studentId: 7 },
  { id: 9, date: "2026-02-15", score: 20, category: "Tidak Stres", studentName: "Fajar Nugroho", studentId: 6 },
  { id: 10, date: "2026-02-12", score: 35, category: "Stres Berat", studentName: "Citra Dewi", studentId: 3 },
  { id: 11, date: "2026-02-10", score: 22, category: "Stres Ringan", studentName: "Budi Santoso", studentId: 2 },
  { id: 12, date: "2026-02-08", score: 10, category: "Tidak Stres", studentName: "Ahmad Fauzi", studentId: 1 },
];

export const studentTestHistory: TestRecord[] = [
  { id: 1, date: "2026-03-01", score: 18, category: "Tidak Stres" },
  { id: 2, date: "2026-02-22", score: 12, category: "Tidak Stres" },
  { id: 3, date: "2026-02-15", score: 27, category: "Stres Ringan" },
  { id: 4, date: "2026-02-08", score: 10, category: "Tidak Stres" },
  { id: 5, date: "2026-02-01", score: 33, category: "Stres Berat" },
  { id: 6, date: "2026-01-25", score: 20, category: "Tidak Stres" },
  { id: 7, date: "2026-01-18", score: 29, category: "Stres Ringan" },
  { id: 8, date: "2026-01-10", score: 15, category: "Tidak Stres" },
];

export const heartRateData: HeartRateRecord[] = [
  { time: "06:00", bpm: 68, date: "2026-03-03" },
  { time: "08:00", bpm: 72, date: "2026-03-03" },
  { time: "09:00", bpm: 85, date: "2026-03-03" },
  { time: "10:00", bpm: 78, date: "2026-03-03" },
  { time: "11:00", bpm: 92, date: "2026-03-03" },
  { time: "12:00", bpm: 75, date: "2026-03-03" },
  { time: "13:00", bpm: 70, date: "2026-03-03" },
  { time: "14:00", bpm: 88, date: "2026-03-03" },
  { time: "15:00", bpm: 95, date: "2026-03-03" },
  { time: "16:00", bpm: 82, date: "2026-03-03" },
  { time: "17:00", bpm: 76, date: "2026-03-03" },
  { time: "18:00", bpm: 69, date: "2026-03-03" },
];

export const iotLiveData: IoTRecord[] = [
  { id: 1, studentName: "Ahmad Fauzi", nim: "20210001", bpm: 72, timestamp: "2026-03-03 15:42:10", status: "Tidak Stres" },
  { id: 2, studentName: "Budi Santoso", nim: "20210002", bpm: 95, timestamp: "2026-03-03 15:42:08", status: "Stres Ringan" },
  { id: 3, studentName: "Citra Dewi", nim: "20210003", bpm: 112, timestamp: "2026-03-03 15:42:05", status: "Stres Berat" },
  { id: 4, studentName: "Dian Pratama", nim: "20210004", bpm: 68, timestamp: "2026-03-03 15:42:03", status: "Tidak Stres" },
  { id: 5, studentName: "Eka Putri", nim: "20210005", bpm: 88, timestamp: "2026-03-03 15:42:01", status: "Stres Ringan" },
  { id: 6, studentName: "Fajar Nugroho", nim: "20210006", bpm: 75, timestamp: "2026-03-03 15:41:58", status: "Tidak Stres" },
  { id: 7, studentName: "Gita Sari", nim: "20210007", bpm: 91, timestamp: "2026-03-03 15:41:55", status: "Stres Ringan" },
  { id: 8, studentName: "Hendra Wijaya", nim: "20210008", bpm: 118, timestamp: "2026-03-03 15:41:52", status: "Stres Berat" },
];

export const monthlyTrendData = [
  { month: "Sep", tidakStres: 12, stresRingan: 5, stresBerat: 2 },
  { month: "Okt", tidakStres: 15, stresRingan: 7, stresBerat: 3 },
  { month: "Nov", tidakStres: 10, stresRingan: 9, stresBerat: 5 },
  { month: "Des", tidakStres: 8, stresRingan: 12, stresBerat: 6 },
  { month: "Jan", tidakStres: 14, stresRingan: 8, stresBerat: 4 },
  { month: "Feb", tidakStres: 18, stresRingan: 6, stresBerat: 3 },
  { month: "Mar", tidakStres: 20, stresRingan: 5, stresBerat: 2 },
];

export const stressDistribution = [
  { name: "Tidak Stres", value: 45, color: "#10B981" },
  { name: "Stres Ringan", value: 35, color: "#F59E0B" },
  { name: "Stres Berat", value: 20, color: "#EF4444" },
];

export const mentalHealthQuestions = [
  {
    id: 1,
    question: "Seberapa sering Anda merasa cemas atau khawatir dalam seminggu terakhir?",
    options: [
      { label: "Tidak pernah", value: 0 },
      { label: "Jarang (1-2 hari)", value: 1 },
      { label: "Kadang-kadang (3-4 hari)", value: 2 },
      { label: "Sering (hampir setiap hari)", value: 3 },
    ],
  },
  {
    id: 2,
    question: "Apakah Anda mengalami kesulitan untuk berkonsentrasi pada tugas atau pelajaran?",
    options: [
      { label: "Tidak pernah", value: 0 },
      { label: "Jarang", value: 1 },
      { label: "Kadang-kadang", value: 2 },
      { label: "Sangat sering", value: 3 },
    ],
  },
  {
    id: 3,
    question: "Seberapa sering Anda merasa lelah secara fisik maupun mental?",
    options: [
      { label: "Tidak pernah", value: 0 },
      { label: "Jarang", value: 1 },
      { label: "Kadang-kadang", value: 2 },
      { label: "Hampir setiap hari", value: 3 },
    ],
  },
  {
    id: 4,
    question: "Apakah Anda mengalami gangguan tidur (sulit tidur atau tidur berlebihan)?",
    options: [
      { label: "Tidak pernah", value: 0 },
      { label: "Jarang (1-2 malam)", value: 1 },
      { label: "Beberapa malam dalam seminggu", value: 2 },
      { label: "Hampir setiap malam", value: 3 },
    ],
  },
  {
    id: 5,
    question: "Seberapa sering Anda merasa tertekan dengan beban akademik?",
    options: [
      { label: "Tidak pernah", value: 0 },
      { label: "Jarang", value: 1 },
      { label: "Kadang-kadang", value: 2 },
      { label: "Sangat sering", value: 3 },
    ],
  },
  {
    id: 6,
    question: "Apakah Anda pernah merasa tidak memiliki motivasi untuk menjalani aktivitas sehari-hari?",
    options: [
      { label: "Tidak pernah", value: 0 },
      { label: "Jarang", value: 1 },
      { label: "Kadang-kadang", value: 2 },
      { label: "Hampir setiap hari", value: 3 },
    ],
  },
  {
    id: 7,
    question: "Seberapa sering Anda merasa mudah marah atau frustrasi?",
    options: [
      { label: "Tidak pernah", value: 0 },
      { label: "Jarang", value: 1 },
      { label: "Kadang-kadang", value: 2 },
      { label: "Hampir setiap hari", value: 3 },
    ],
  },
  {
    id: 8,
    question: "Apakah Anda merasa terisolasi atau kesepian dari lingkungan sosial?",
    options: [
      { label: "Tidak pernah", value: 0 },
      { label: "Jarang", value: 1 },
      { label: "Kadang-kadang", value: 2 },
      { label: "Sangat sering", value: 3 },
    ],
  },
  {
    id: 9,
    question: "Seberapa sering Anda mengalami sakit kepala, sakit perut, atau keluhan fisik akibat stres?",
    options: [
      { label: "Tidak pernah", value: 0 },
      { label: "Jarang", value: 1 },
      { label: "Kadang-kadang", value: 2 },
      { label: "Sangat sering", value: 3 },
    ],
  },
  {
    id: 10,
    question: "Apakah Anda merasa sulit untuk bersantai atau menenangkan pikiran?",
    options: [
      { label: "Tidak pernah", value: 0 },
      { label: "Jarang", value: 1 },
      { label: "Kadang-kadang", value: 2 },
      { label: "Hampir selalu", value: 3 },
    ],
  },
];

export function getStressCategory(score: number): StressLevel {
  if (score <= 15) return "Tidak Stres";
  if (score <= 25) return "Stres Ringan";
  return "Stres Berat";
}

export function getStressColor(category: StressLevel): string {
  switch (category) {
    case "Tidak Stres": return "#10B981";
    case "Stres Ringan": return "#F59E0B";
    case "Stres Berat": return "#EF4444";
  }
}

export function getStressBgClass(category: StressLevel): string {
  switch (category) {
    case "Tidak Stres": return "bg-emerald-100 text-emerald-700";
    case "Stres Ringan": return "bg-amber-100 text-amber-700";
    case "Stres Berat": return "bg-red-100 text-red-700";
  }
}
