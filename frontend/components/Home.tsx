"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Brain,
  Heart,
  Menu,
  X,
  ChevronRight,
  Shield,
  Wifi,
  BarChart2,
  Bell,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
const logoImg = "/logo.svg";

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M13.5 8H16V5h-2.5C10.8 5 9 6.8 9 9.5V12H7v3h2v4h3v-4h2.4l.6-3H12V9.5c0-.9.6-1.5 1.5-1.5z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className} aria-hidden="true">
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" strokeWidth="2" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.9 7.2c.8-.1 1.4-.4 2.1-.8-.3.8-.9 1.4-1.6 1.8.7 4.7-2.8 9.8-9.3 9.8-1.8 0-3.4-.5-4.8-1.4 1.7.2 3.4-.3 4.8-1.3-1.4 0-2.6-.9-3-2.3.5.1 1 .1 1.4-.1-1.6-.3-2.7-1.8-2.6-3.4.5.3 1 .5 1.6.6-1.5-1-1.9-3-.9-4.5C8 8 10 9.2 12.3 9.3c-.4-1.8 1-3.5 2.9-3.5.9 0 1.8.4 2.4 1 .7-.1 1.4-.4 2-.8-.2.8-.8 1.4-1.7 1.8z" />
  </svg>
);

const heroStudentImg =
  "/images/landing-hero.svg";
const iotImg = "/images/iot-device.svg";
const campusImg = "/images/campus-students.svg";

const navLinks = [
  { label: "Beranda", href: "#beranda" },
  { label: "Fitur", href: "#fitur" },
  { label: "Tentang", href: "#tentang" },
  { label: "Kontak", href: "#kontak" },
];

const features = [
  {
    icon: Heart,
    title: "Monitoring Detak Jantung",
    desc: "Sensor IoT memantau detak jantung mahasiswa secara real-time dan mengirim data ke sistem untuk analisis otomatis.",
    color: "#EF4444",
    bg: "#FEF2F2",
  },
  {
    icon: Brain,
    title: "Kuesioner Psikologis",
    desc: "Tes kesehatan mental berbasis kuesioner terstandar untuk mendeteksi tingkat stres secara mandiri oleh mahasiswa.",
    color: "#8B5CF6",
    bg: "#F5F3FF",
  },
  {
    icon: BarChart2,
    title: "Analisis & Klasifikasi",
    desc: "Sistem mengklasifikasikan tingkat stres menjadi tiga kategori: Normal, Stres Ringan, dan Stres Berat secara otomatis.",
    color: "#1E6CB5",
    bg: "#EFF6FF",
  },
  {
    icon: Bell,
    title: "Notifikasi Real-time",
    desc: "Admin mendapat notifikasi segera ketika mahasiswa terindikasi mengalami stres berat untuk tindak lanjut cepat.",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    icon: Wifi,
    title: "IoT Terintegrasi",
    desc: "Perangkat wearable terhubung langsung ke platform web untuk pengiriman data tanpa hambatan kapanpun.",
    color: "#10B981",
    bg: "#ECFDF5",
  },
  {
    icon: Shield,
    title: "Data Privat & Aman",
    desc: "Data kesehatan mental mahasiswa dikelola dengan enkripsi penuh dan hanya dapat diakses oleh pihak berwenang.",
    color: "#1A3A8F",
    bg: "#EFF6FF",
  },
];

const stats = [
  { value: "500+", label: "Mahasiswa Terdaftar" },
  { value: "98%", label: "Akurasi Deteksi" },
  { value: "24/7", label: "Monitoring Aktif" },
  { value: "3 Detik", label: "Respons Real-time" },
];

const teamMembers = [
  { name: "Dr. Rini Susilowati, M.Kom", role: "Pembimbing Utama", avatar: "RS" },
  { name: "Ahmad Fauzi Ramadhan", role: "Developer & IoT Engineer", avatar: "AF" },
  { name: "Citra Dewi Anggraini", role: "UI/UX Designer", avatar: "CD" },
];

export function Home() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("beranda");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = ["beranda", "fitur", "tentang", "kontak"];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 100) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* ======================== NAVBAR ======================== */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
          boxShadow: scrolled ? "0 2px 24px rgba(26,58,143,0.10)" : "none",
          backdropFilter: scrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo("#beranda")}>
              <Image
                src={logoImg}
                alt="MELTALCARE"
                width={36}
                height={36}
                className="w-9 h-9 object-contain rounded-xl"
                style={{ background: scrolled ? "none" : "rgba(255,255,255,0.15)", padding: 2 }}
              />
              <div>
                <span
                  className="text-base block"
                  style={{
                    fontWeight: 700,
                    color: scrolled ? "#1A3A8F" : "white",
                    letterSpacing: "0.04em",
                    lineHeight: 1.1,
                  }}
                >
                  MELTALCARE
                </span>
                <span
                  className="text-xs block"
                  style={{
                    fontWeight: 400,
                    color: scrolled ? "#64748B" : "rgba(255,255,255,0.75)",
                    lineHeight: 1.2,
                  }}
                >
                  Monitoring Stres Pelajar
                </span>
              </div>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="px-4 py-2 rounded-lg text-sm transition-all duration-200 relative"
                  style={{
                    fontWeight: activeSection === link.href.replace("#", "") ? 600 : 500,
                    color:
                      activeSection === link.href.replace("#", "")
                        ? scrolled
                          ? "#1E6CB5"
                          : "white"
                        : scrolled
                        ? "#374151"
                        : "rgba(255,255,255,0.85)",
                    background:
                      activeSection === link.href.replace("#", "") && scrolled
                        ? "rgba(30,108,181,0.08)"
                        : "transparent",
                  }}
                >
                  {link.label}
                  {activeSection === link.href.replace("#", "") && (
                    <span
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                      style={{ background: scrolled ? "#1E6CB5" : "white" }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2 rounded-xl text-sm transition-all duration-200 inline-flex items-center"
                style={{
                  fontWeight: 600,
                  color: scrolled ? "#1E6CB5" : "white",
                  border: `1.5px solid ${scrolled ? "#1E6CB5" : "rgba(255,255,255,0.6)"}`,
                  background: scrolled
                    ? "rgba(30,108,181,0.08)"
                    : "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))",
                  boxShadow: scrolled ? "none" : "0 4px 14px rgba(0,0,0,0.1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                Masuk
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg transition-all"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ color: scrolled ? "#1A3A8F" : "white" }}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="md:hidden border-t"
            style={{
              background: "rgba(255,255,255,0.98)",
              backdropFilter: "blur(12px)",
              borderColor: "#E5E7EB",
            }}
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="text-left px-4 py-3 rounded-xl text-sm transition-all"
                  style={{
                    fontWeight: 500,
                    color: activeSection === link.href.replace("#", "") ? "#1E6CB5" : "#374151",
                    background:
                      activeSection === link.href.replace("#", "")
                        ? "rgba(30,108,181,0.08)"
                        : "transparent",
                  }}
                >
                  {link.label}
                </button>
              ))}
              <div className="border-t mt-2 pt-3 flex flex-col gap-2" style={{ borderColor: "#E5E7EB" }}>
                <Link
                  href="/login"
                  className="py-3 rounded-xl text-sm text-white text-center"
                  style={{
                    fontWeight: 600,
                    background: "linear-gradient(135deg, #1A3A8F 0%, #29ABE2 100%)",
                  }}
                >
                  Masuk
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ======================== HERO SECTION ======================== */}
      <section
        id="beranda"
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: "linear-gradient(145deg, #1A3A8F 0%, #1E6CB5 55%, #29ABE2 100%)" }}
      >
        {/* Background decorative */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10"
            style={{ background: "white" }}
          />
          <div
            className="absolute bottom-0 -left-16 w-80 h-80 rounded-full opacity-10"
            style={{ background: "white" }}
          />
          <div
            className="absolute top-1/3 right-1/4 w-48 h-48 rounded-full opacity-5"
            style={{ background: "white" }}
          />
          {/* Grid dots pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
              >
                <Activity className="w-3.5 h-3.5 text-blue-200" />
                <span className="text-blue-100 text-xs" style={{ fontWeight: 500 }}>
                  Sistem Monitoring Berbasis IoT & Web
                </span>
              </div>

              <h1
                className="text-white mb-6"
                style={{ fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.2 }}
              >
                Pantau Kesehatan Mental{" "}
                <span style={{ color: "#7DCFF7" }}>Mahasiswa</span>
                <br />Dengan Teknologi Cerdas
              </h1>

              <p
                className="text-blue-100 mb-8 max-w-lg"
                style={{ fontWeight: 400, lineHeight: 1.8, fontSize: "1rem" }}
              >
                MELTALCARE mengintegrasikan sensor IoT detak jantung dan kuesioner psikologis untuk
                mendeteksi dini indikasi stres pada pelajar secara akurat dan real-time.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-10">
                <button
                  onClick={() => router.push("/login")}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm transition-all duration-200"
                  style={{
                    fontWeight: 600,
                    background: "white",
                    color: "#1A3A8F",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")
                  }
                >
                  Mulai Sekarang
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollTo("#tentang")}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm transition-all duration-200"
                  style={{
                    fontWeight: 600,
                    color: "white",
                    border: "1.5px solid rgba(255,255,255,0.5)",
                    background: "rgba(255,255,255,0.1)",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.18)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)")
                  }
                >
                  Pelajari Lebih Lanjut
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Feature Chips */}
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Activity, label: "IoT Sensor" },
                  { icon: Brain, label: "AI Klasifikasi" },
                  { icon: Heart, label: "Real-time" },
                  { icon: Shield, label: "Data Aman" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-full px-3 py-1.5"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    <Icon className="w-3.5 h-3.5 text-blue-200" />
                    <span className="text-white text-xs" style={{ fontWeight: 500 }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Illustration / Dashboard Preview */}
            <div className="relative hidden lg:flex justify-center items-center">
              {/* Main Card */}
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl w-80 h-52"
                style={{ border: "1px solid rgba(255,255,255,0.2)" }}
              >
                <Image
                  src={heroStudentImg}
                  alt="Student monitoring"
                  width={1080}
                  height={720}
                  className="w-full h-full object-cover"
                  style={{ opacity: 0.85 }}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(26,58,143,0.7) 100%)" }}
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white text-sm" style={{ fontWeight: 600 }}>
                    Monitoring Aktif
                  </p>
                  <p className="text-blue-200 text-xs" style={{ fontWeight: 400 }}>
                    500+ mahasiswa terpantau
                  </p>
                </div>
              </div>

              {/* Floating BPM Card */}
              <div
                className="absolute -left-12 top-8 rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 8px 32px rgba(26,58,143,0.2)",
                  minWidth: 140,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "#FEF2F2" }}
                  >
                    <Heart className="w-4 h-4" style={{ color: "#EF4444" }} fill="#FCA5A5" />
                  </div>
                  <span className="text-xs" style={{ fontWeight: 600, color: "#374151" }}>
                    Detak Jantung
                  </span>
                </div>
                <p className="text-2xl" style={{ fontWeight: 700, color: "#1A3A8F" }}>
                  72 <span className="text-sm" style={{ color: "#64748B", fontWeight: 400 }}>BPM</span>
                </p>
                <p className="text-xs" style={{ color: "#10B981", fontWeight: 600 }}>● Normal</p>
              </div>

              {/* Floating Status Card */}
              <div
                className="absolute -right-10 bottom-8 rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 8px 32px rgba(26,58,143,0.2)",
                  minWidth: 160,
                }}
              >
                <p className="text-xs mb-2" style={{ fontWeight: 600, color: "#374151" }}>
                  Status Stres Hari Ini
                </p>
                {[
                  { label: "Tidak Stres", pct: 60, color: "#10B981" },
                  { label: "Ringan", pct: 28, color: "#F59E0B" },
                  { label: "Berat", pct: 12, color: "#EF4444" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${s.pct}%`, background: s.color }}
                      />
                    </div>
                    <span className="text-xs w-8 text-right" style={{ color: "#64748B", fontWeight: 500 }}>
                      {s.pct}%
                    </span>
                  </div>
                ))}
              </div>

              {/* ECG pulse line */}
              <div
                className="absolute top-4 right-6 rounded-xl px-3 py-2"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <svg viewBox="0 0 120 40" width="120" height="40" fill="none">
                  <polyline
                    points="0,20 20,20 28,20 33,5 38,34 43,20 55,20 65,20 70,20 76,8 81,32 86,20 100,20 120,20"
                    stroke="#7DCFF7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="120" cy="20" r="3" fill="#29ABE2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {stats.map((s) => (
              <div
                key={s.label}
                className="text-center p-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <p className="text-white text-2xl" style={{ fontWeight: 700 }}>
                  {s.value}
                </p>
                <p className="text-blue-200 text-xs mt-1" style={{ fontWeight: 400 }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
          <svg viewBox="0 0 1440 60" className="w-full" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ======================== FITUR SECTION ======================== */}
      <section id="fitur" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs px-4 py-1.5 rounded-full mb-4"
              style={{
                background: "rgba(30,108,181,0.08)",
                color: "#1E6CB5",
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              FITUR UNGGULAN
            </span>
            <h2 className="mb-4" style={{ fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: "#1A3A8F" }}>
              Teknologi Canggih untuk Kesehatan Mental
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: "#64748B", fontWeight: 400, lineHeight: 1.7 }}>
              MELTALCARE menghadirkan berbagai fitur inovatif yang memadukan IoT, analisis data,
              dan kecerdasan buatan untuk mendukung kesejahteraan mahasiswa.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border transition-all duration-300 group cursor-default"
                style={{
                  borderColor: "#F1F5F9",
                  background: "white",
                  boxShadow: "0 2px 12px rgba(26,58,143,0.04)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 32px rgba(26,58,143,0.12)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.borderColor = f.color + "30";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 2px 12px rgba(26,58,143,0.04)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#F1F5F9";
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: f.bg }}
                >
                  <f.icon className="w-6 h-6" style={{ color: f.color }} />
                </div>
                <h3 className="mb-2" style={{ fontWeight: 600, color: "#1A3A8F", fontSize: "0.95rem" }}>
                  {f.title}
                </h3>
                <p className="text-sm" style={{ color: "#64748B", fontWeight: 400, lineHeight: 1.7 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== TENTANG SECTION ======================== */}
      <section id="tentang" className="py-20" style={{ background: "#F8FAFF" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Left Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl h-72 lg:h-96">
                <Image src={iotImg} alt="IoT Device" width={1080} height={720} className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top right, rgba(26,58,143,0.5) 0%, transparent 60%)" }}
                />
              </div>
              {/* Floating label */}
              <div
                className="absolute -bottom-5 -right-5 rounded-2xl p-4 shadow-xl"
                style={{ background: "white", minWidth: 180 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #1A3A8F, #29ABE2)" }}
                  >
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs" style={{ fontWeight: 600, color: "#1A3A8F" }}>
                      Sensor IoT
                    </p>
                    <p className="text-xs" style={{ color: "#10B981", fontWeight: 500 }}>
                      ● Aktif & Terhubung
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div>
              <span
                className="inline-block text-xs px-4 py-1.5 rounded-full mb-4"
                style={{ background: "rgba(30,108,181,0.08)", color: "#1E6CB5", fontWeight: 600 }}
              >
                TENTANG SISTEM
              </span>
              <h2 className="mb-5" style={{ fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "#1A3A8F" }}>
                Apa itu MELTALCARE?
              </h2>
              <p className="mb-4" style={{ color: "#64748B", fontWeight: 400, lineHeight: 1.8 }}>
                <strong style={{ color: "#1A3A8F" }}>MELTALCARE</strong> (Monitoring Indikasi Stres
                pada Pelajar Berbasis IoT dan Web) adalah sistem cerdas yang dirancang untuk memantau
                dan mendeteksi kondisi stres pada mahasiswa secara komprehensif.
              </p>
              <p className="mb-6" style={{ color: "#64748B", fontWeight: 400, lineHeight: 1.8 }}>
                Sistem ini menggabungkan data fisiologis dari sensor detak jantung (IoT) dengan hasil
                kuesioner psikologis untuk memberikan penilaian tingkat stres yang akurat dan
                mendalam kepada mahasiswa maupun administrator.
              </p>

              {/* Checklist */}
              <div className="space-y-3 mb-8">
                {[
                  "Deteksi dini stres berbasis data fisiologis & psikologis",
                  "Dashboard real-time untuk admin dan mahasiswa",
                  "Riwayat lengkap tes dan data detak jantung",
                  "Notifikasi otomatis ketika stres terdeteksi",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#10B981" }} />
                    <span className="text-sm" style={{ color: "#374151", fontWeight: 400, lineHeight: 1.6 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => router.push("/login")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm text-white transition-all duration-200"
                style={{
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #1A3A8F 0%, #1E6CB5 100%)",
                  boxShadow: "0 4px 14px rgba(30,108,181,0.3)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.transform = "translateY(-1px)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")
                }
              >
                Masuk ke Sistem
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Campus Image + Cara Kerja */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Cara Kerja */}
            <div>
              <span
                className="inline-block text-xs px-4 py-1.5 rounded-full mb-4"
                style={{ background: "rgba(30,108,181,0.08)", color: "#1E6CB5", fontWeight: 600 }}
              >
                CARA KERJA
              </span>
              <h2 className="mb-8" style={{ fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "#1A3A8F" }}>
                Bagaimana MELTALCARE Bekerja?
              </h2>

              <div className="space-y-5">
                {[
                  {
                    step: "01",
                    title: "Pakai Perangkat IoT",
                    desc: "Mahasiswa menggunakan sensor detak jantung yang terhubung ke sistem secara wireless.",
                    color: "#29ABE2",
                  },
                  {
                    step: "02",
                    title: "Ikuti Kuesioner",
                    desc: "Mahasiswa menjawab kuesioner kesehatan mental yang terstandar secara berkala.",
                    color: "#1E6CB5",
                  },
                  {
                    step: "03",
                    title: "Analisis Otomatis",
                    desc: "Sistem menganalisis data gabungan dan mengklasifikasikan tingkat stres secara otomatis.",
                    color: "#8B5CF6",
                  },
                  {
                    step: "04",
                    title: "Lihat Hasil & Tindak Lanjut",
                    desc: "Mahasiswa dan admin mendapat hasil lengkap dengan rekomendasi tindak lanjut.",
                    color: "#10B981",
                  },
                ].map((s, i) => (
                  <div key={s.step} className="flex gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-sm"
                      style={{ background: s.color, fontWeight: 700 }}
                    >
                      {s.step}
                    </div>
                    <div>
                      <p className="mb-1 text-sm" style={{ fontWeight: 600, color: "#1A3A8F" }}>
                        {s.title}
                      </p>
                      <p className="text-sm" style={{ color: "#64748B", fontWeight: 400, lineHeight: 1.6 }}>
                        {s.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl h-72 lg:h-96">
                <Image src={campusImg} alt="University students" width={1080} height={720} className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(26,58,143,0.4) 0%, transparent 60%)" }}
                />
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="mt-20 text-center">
            <span
              className="inline-block text-xs px-4 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(30,108,181,0.08)", color: "#1E6CB5", fontWeight: 600 }}
            >
              TIM PENGEMBANG
            </span>
            <h2 className="mb-10" style={{ fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: "#1A3A8F" }}>
              Di Balik MELTALCARE
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {teamMembers.map((m) => (
                <div
                  key={m.name}
                  className="flex flex-col items-center p-6 rounded-2xl border"
                  style={{
                    borderColor: "#E5E7EB",
                    background: "white",
                    boxShadow: "0 2px 12px rgba(26,58,143,0.06)",
                    minWidth: 200,
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4"
                    style={{
                      background: "linear-gradient(135deg, #1A3A8F, #29ABE2)",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                    }}
                  >
                    {m.avatar}
                  </div>
                  <p className="text-sm" style={{ fontWeight: 600, color: "#1A3A8F" }}>
                    {m.name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "#64748B", fontWeight: 400 }}>
                    {m.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================== CTA BANNER ======================== */}
      <section
        className="py-16"
        style={{ background: "linear-gradient(135deg, #1A3A8F 0%, #1E6CB5 60%, #29ABE2 100%)" }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2
            className="text-white mb-4"
            style={{ fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.2rem)" }}
          >
            Siap Memantau Kesehatan Mental Anda?
          </h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto" style={{ fontWeight: 400, lineHeight: 1.7 }}>
            Bergabung dengan lebih dari 500 mahasiswa yang telah menggunakan MELTALCARE untuk
            menjaga kesejahteraan mental mereka.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm transition-all duration-200"
              style={{
                fontWeight: 600,
                background: "white",
                color: "#1A3A8F",
                boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.transform = "translateY(-2px)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")
              }
            >
              Masuk ke Sistem
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollTo("#kontak")}
              className="px-7 py-3.5 rounded-xl text-sm transition-all duration-200"
              style={{
                fontWeight: 600,
                color: "white",
                border: "1.5px solid rgba(255,255,255,0.5)",
                background: "rgba(255,255,255,0.1)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.18)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)")
              }
            >
              Hubungi Kami
            </button>
          </div>
        </div>
      </section>

      {/* ======================== KONTAK SECTION ======================== */}
      <section id="kontak" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs px-4 py-1.5 rounded-full mb-4"
              style={{ background: "rgba(30,108,181,0.08)", color: "#1E6CB5", fontWeight: 600 }}
            >
              KONTAK
            </span>
            <h2 className="mb-4" style={{ fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: "#1A3A8F" }}>
              Hubungi Kami
            </h2>
            <p className="max-w-md mx-auto" style={{ color: "#64748B", fontWeight: 400, lineHeight: 1.7 }}>
              Ada pertanyaan atau ingin mengetahui lebih lanjut? Jangan ragu untuk menghubungi kami.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              {[
                {
                  icon: Mail,
                  title: "Email",
                  value: "meltalcare@university.ac.id",
                  desc: "Respon dalam 1x24 jam",
                  color: "#1E6CB5",
                  bg: "#EFF6FF",
                },
                {
                  icon: Phone,
                  title: "Telepon",
                  value: "+62 812-3456-7890",
                  desc: "Senin – Jumat, 08.00 – 16.00 WIB",
                  color: "#10B981",
                  bg: "#ECFDF5",
                },
                {
                  icon: MapPin,
                  title: "Lokasi",
                  value: "Laboratorium IoT, Gedung Teknologi",
                  desc: "Universitas Teknologi Indonesia",
                  color: "#EF4444",
                  bg: "#FEF2F2",
                },
              ].map((c) => (
                <div key={c.title} className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: c.bg }}
                  >
                    <c.icon className="w-5 h-5" style={{ color: c.color }} />
                  </div>
                  <div>
                    <p className="text-xs mb-1" style={{ fontWeight: 600, color: "#9CA3AF", letterSpacing: "0.05em" }}>
                      {c.title.toUpperCase()}
                    </p>
                    <p className="text-sm" style={{ fontWeight: 600, color: "#1A3A8F" }}>
                      {c.value}
                    </p>
                    <p className="text-xs" style={{ color: "#64748B", fontWeight: 400 }}>
                      {c.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div
              className="rounded-2xl p-8 border"
              style={{
                borderColor: "#E5E7EB",
                background: "#F8FAFF",
                boxShadow: "0 2px 12px rgba(26,58,143,0.06)",
              }}
            >
              <h3 className="mb-6 text-base" style={{ fontWeight: 600, color: "#1A3A8F" }}>
                Kirim Pesan
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: "#374151" }}>
                      Nama
                    </label>
                    <input
                      type="text"
                      placeholder="Nama Lengkap"
                      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{
                        borderColor: "#E5E7EB",
                        background: "white",
                        color: "#111827",
                        fontWeight: 400,
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#1E6CB5")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    />
                  </div>
                  <div>
                    <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: "#374151" }}>
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                      style={{
                        borderColor: "#E5E7EB",
                        background: "white",
                        color: "#111827",
                        fontWeight: 400,
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#1E6CB5")}
                      onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: "#374151" }}>
                    Subjek
                  </label>
                  <input
                    type="text"
                    placeholder="Subjek pesan"
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                    style={{
                      borderColor: "#E5E7EB",
                      background: "white",
                      color: "#111827",
                      fontWeight: 400,
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#1E6CB5")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </div>
                <div>
                  <label className="text-xs block mb-1.5" style={{ fontWeight: 500, color: "#374151" }}>
                    Pesan
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tulis pesan Anda di sini..."
                    className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none resize-none"
                    style={{
                      borderColor: "#E5E7EB",
                      background: "white",
                      color: "#111827",
                      fontWeight: 400,
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#1E6CB5")}
                    onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                  />
                </div>
                <button
                  className="w-full py-3 rounded-xl text-sm text-white transition-all duration-200"
                  style={{
                    fontWeight: 600,
                    background: "linear-gradient(135deg, #1A3A8F 0%, #1E6CB5 100%)",
                    boxShadow: "0 4px 14px rgba(30,108,181,0.3)",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.transform = "translateY(-1px)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.transform = "translateY(0)")
                  }
                >
                  Kirim Pesan
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== FOOTER ======================== */}
      <footer style={{ background: "#0F1F5C" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src={logoImg}
                  alt="MELTALCARE"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain rounded-xl"
                  style={{ background: "rgba(255,255,255,0.1)", padding: 2 }}
                />
                <div>
                  <span className="text-white block" style={{ fontWeight: 700, letterSpacing: "0.04em" }}>
                    MELTALCARE
                  </span>
                  <span className="text-blue-300 text-xs block" style={{ fontWeight: 400 }}>
                    Monitoring Stres Pelajar
                  </span>
                </div>
              </div>
              <p className="text-sm mb-5 max-w-xs" style={{ color: "#94A3B8", fontWeight: 400, lineHeight: 1.7 }}>
                Sistem monitoring indikasi stres pada pelajar berbasis IoT dan Web untuk mendukung
                kesejahteraan mental mahasiswa.
              </p>
              <div className="flex gap-3">
                {[FacebookIcon, InstagramIcon, TwitterIcon].map((Icon, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)")
                    }
                  >
                    <Icon className="w-4 h-4 text-blue-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <p className="text-white text-sm mb-4" style={{ fontWeight: 600 }}>
                Navigasi
              </p>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => scrollTo(link.href)}
                      className="text-sm transition-colors duration-200"
                      style={{ color: "#94A3B8", fontWeight: 400 }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#29ABE2")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#94A3B8")}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Access */}
            <div>
              <p className="text-white text-sm mb-4" style={{ fontWeight: 600 }}>
                Akses Cepat
              </p>
              <ul className="space-y-2">
                {[
                  { label: "Login Mahasiswa", path: "/login" },
                  { label: "Login Admin", path: "/login" },
                  { label: "Panduan Pengguna", path: "#" },
                  { label: "FAQ", path: "#" },
                ].map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => (item.path !== "#" ? router.push(item.path) : null)}
                      className="text-sm transition-colors duration-200"
                      style={{ color: "#94A3B8", fontWeight: 400 }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#29ABE2")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#94A3B8")}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
          >
            <p className="text-xs" style={{ color: "#64748B", fontWeight: 400 }}>
              © 2026 MELTALCARE. All rights reserved. Sistem Monitoring Stres Pelajar Berbasis IoT.
            </p>
            <div className="flex gap-4">
              {["Kebijakan Privasi", "Syarat & Ketentuan"].map((t) => (
                <button
                  key={t}
                  className="text-xs transition-colors"
                  style={{ color: "#64748B", fontWeight: 400 }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#29ABE2")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#64748B")}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

