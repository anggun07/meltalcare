"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Calendar,
  Edit2,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { getCurrentUser, getInitials, saveSession } from "@/lib/auth";

interface StudentResponse {
  message?: string;
  data: {
    id: number;
    nim: string;
    name: string;
    phone: string | null;
    birth_date: string | null;
    faculty: string | null;
    study_program: string | null;
    semester: number | null;
    address: string | null;
    user: {
      id: number;
      name: string;
      email: string;
      role: "mahasiswa";
    };
  };
}

interface ProfileForm {
  name: string;
  nim: string;
  email: string;
  phone: string;
  birthDate: string;
  faculty: string;
  studyProgram: string;
  semester: string;
  address: string;
}

const emptyProfile: ProfileForm = {
  name: "",
  nim: "",
  email: "",
  phone: "",
  birthDate: "",
  faculty: "",
  studyProgram: "",
  semester: "",
  address: "",
};

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all";

function mapStudent(student: StudentResponse["data"]): ProfileForm {
  return {
    name: student.name || student.user.name,
    nim: student.nim,
    email: student.user.email,
    phone: student.phone || "",
    birthDate: student.birth_date || "",
    faculty: student.faculty || "",
    studyProgram: student.study_program || "",
    semester: student.semester ? String(student.semester) : "",
    address: student.address || "",
  };
}

function displayValue(value: string) {
  return value.trim() || "Belum diisi";
}

export function StudentProfileConnected() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [studentId, setStudentId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProfileForm>(emptyProfile);
  const [savedData, setSavedData] = useState<ProfileForm>(emptyProfile);

  useEffect(() => {
    const loadProfile = async () => {
      const currentUser = getCurrentUser();
      const id = currentUser?.student?.id;

      if (!id) {
        setError("Data mahasiswa tidak ditemukan pada akun ini. Silakan login ulang.");
        setLoading(false);
        return;
      }

      setStudentId(id);

      try {
        const response = await apiRequest<StudentResponse>(`/students/${id}`);
        const profile = mapStudent(response.data);
        setFormData(profile);
        setSavedData(profile);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal mengambil profil mahasiswa.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleCancel = () => {
    setFormData(savedData);
    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!studentId) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await apiRequest<StudentResponse>(`/students/${studentId}`, {
        method: "PATCH",
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          birth_date: formData.birthDate || null,
          faculty: formData.faculty || null,
          study_program: formData.studyProgram || null,
          semester: formData.semester ? Number(formData.semester) : null,
          address: formData.address || null,
        },
      });

      const profile = mapStudent(response.data);
      setFormData(profile);
      setSavedData(profile);
      setIsEditing(false);
      setSuccess(response.message || "Profil berhasil diperbarui.");

      const currentUser = getCurrentUser();
      if (currentUser) {
        saveSession({
          ...currentUser,
          name: response.data.user.name,
          email: response.data.user.email,
          student: {
            id: response.data.id,
            nim: response.data.nim,
            name: response.data.name,
          },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan profil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-gray-800 text-2xl" style={{ fontWeight: 700 }}>Profil Mahasiswa</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola informasi pribadi dan akademik Anda</p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => { setIsEditing(true); setSuccess(""); }}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-white transition-all hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #1A3A8F, #29ABE2)", fontWeight: 500 }}
          >
            <Edit2 className="w-4 h-4" /> Edit Profil
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleCancel} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200">
              <X className="w-4 h-4" /> Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #10B981, #059669)", fontWeight: 500 }}
            >
              <Save className="w-4 h-4" /> {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        )}
      </div>

      {error && <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}
      {success && <div className="px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">{success}</div>}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32" style={{ background: "linear-gradient(135deg, #1A3A8F, #29ABE2)" }} />
        <div className="px-6 pb-6">
          <div className="flex items-start gap-6 -mt-16">
            <div
              className="w-32 h-32 rounded-2xl flex items-center justify-center text-4xl border-4 border-white shadow-lg flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #29ABE2, #4FC3F7)", fontWeight: 700, color: "white" }}
            >
              {getInitials(formData.name)}
            </div>
            <div className="flex-1 mt-16 min-w-0">
              <h2 className="text-gray-800 text-xl truncate" style={{ fontWeight: 700 }}>{formData.name}</h2>
              <p className="text-gray-500" style={{ fontWeight: 500 }}>NIM: {formData.nim}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm" style={{ fontWeight: 500 }}>
                  {displayValue(formData.studyProgram)}
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm" style={{ fontWeight: 500 }}>
                  {formData.semester ? `Semester ${formData.semester}` : "Semester belum diisi"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-gray-800 text-lg mb-6" style={{ fontWeight: 600 }}>Informasi Detail</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileField label="Nama Lengkap" icon={User} editing={isEditing} value={formData.name}>
            <input name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
          </ProfileField>

          <ProfileField label="NIM" icon={GraduationCap} editing={false} value={formData.nim} />

          <ProfileField label="Email" icon={Mail} editing={isEditing} value={formData.email}>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} required />
          </ProfileField>

          <ProfileField label="Nomor Telepon" icon={Phone} editing={isEditing} value={formData.phone}>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="Contoh: 081234567890" />
          </ProfileField>

          <ProfileField
            label="Tanggal Lahir"
            icon={Calendar}
            editing={isEditing}
            value={formData.birthDate ? new Date(`${formData.birthDate}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : ""}
          >
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className={inputClass} />
          </ProfileField>

          <ProfileField label="Fakultas" icon={GraduationCap} editing={isEditing} value={formData.faculty}>
            <input name="faculty" value={formData.faculty} onChange={handleChange} className={inputClass} placeholder="Contoh: Fakultas Teknik" />
          </ProfileField>

          <ProfileField label="Program Studi" icon={BookOpen} editing={isEditing} value={formData.studyProgram}>
            <input name="studyProgram" value={formData.studyProgram} onChange={handleChange} className={inputClass} placeholder="Contoh: Teknik Informatika" />
          </ProfileField>

          <ProfileField label="Semester" icon={BookOpen} editing={isEditing} value={formData.semester ? `Semester ${formData.semester}` : ""}>
            <select name="semester" value={formData.semester} onChange={handleChange} className={inputClass}>
              <option value="">Pilih semester</option>
              {Array.from({ length: 14 }, (_, index) => index + 1).map((semester) => (
                <option key={semester} value={semester}>Semester {semester}</option>
              ))}
            </select>
          </ProfileField>

          <div className="md:col-span-2">
            <ProfileField label="Alamat" icon={MapPin} editing={isEditing} value={formData.address}>
              <textarea name="address" value={formData.address} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} placeholder="Masukkan alamat lengkap" />
            </ProfileField>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileField({
  label,
  icon: Icon,
  editing,
  value,
  children,
}: {
  label: string;
  icon: typeof User;
  editing: boolean;
  value: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 text-gray-600 text-sm mb-2" style={{ fontWeight: 500 }}>
        <Icon className="w-4 h-4" /> {label}
      </label>
      {editing && children ? children : (
        <p className={`px-4 py-2.5 ${value ? "text-gray-800" : "text-gray-400"}`}>{displayValue(value)}</p>
      )}
    </div>
  );
}
