export type StressLevel = "Tidak Stres" | "Stres Ringan" | "Stres Berat";

export interface MentalHealthTestApi {
  id: number;
  student_id: number;
  score: number;
  max_score: number;
  category: StressLevel;
  answers: number[] | null;
  tested_at: string;
  student?: {
    id: number;
    nim: string;
    name: string;
    user?: {
      id: number;
      name: string;
      email: string;
    };
  };
}

export interface TestRecord {
  id: number;
  date: string;
  score: number;
  maxScore: number;
  category: StressLevel;
  studentName?: string;
  studentId?: number;
  nim?: string;
}

export interface StudentApi {
  id: number;
  nim: string;
  name: string;
  faculty: string | null;
  study_program: string | null;
  semester: number | null;
  mental_health_tests_count: number;
  mental_health_tests: MentalHealthTestApi[];
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface DashboardData {
  total_students: number;
  total_tests: number;
  tests_today: number;
  tests_this_month: number;
  distribution: Array<{
    category: StressLevel;
    count: number;
    percentage: number;
  }>;
  monthly_trend: Array<{
    month: string;
    tidak_stres: number;
    stres_ringan: number;
    stres_berat: number;
  }>;
  recent_tests: MentalHealthTestApi[];
}

export function toTestRecord(test: MentalHealthTestApi): TestRecord {
  return {
    id: test.id,
    date: test.tested_at,
    score: test.score,
    maxScore: test.max_score,
    category: test.category,
    studentName: test.student?.name || test.student?.user?.name,
    studentId: test.student_id,
    nim: test.student?.nim,
  };
}

export function initials(name?: string) {
  return (name || "-")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
