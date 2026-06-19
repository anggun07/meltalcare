import { StressLevel, getStressBgClass } from "./mockData";

interface StressBadgeProps {
  category: StressLevel;
  size?: "sm" | "md";
}

export function StressBadge({ category, size = "md" }: StressBadgeProps) {
  const baseClasses = `inline-flex items-center rounded-full font-medium ${getStressBgClass(category)}`;
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";
  
  const dot = {
    "Tidak Stres": "bg-emerald-500",
    "Stres Ringan": "bg-amber-500",
    "Stres Berat": "bg-red-500",
  }[category];

  return (
    <span className={`${baseClasses} ${sizeClasses} gap-1.5`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {category}
    </span>
  );
}
