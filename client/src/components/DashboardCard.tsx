import type { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  icon: ReactNode;
  onClick?: () => void;
  variant?: "default" | "primary";
}

export default function DashboardCard({
  title,
  icon,
  onClick,
  variant = "default",
}: DashboardCardProps) {
  const baseStyles =
    "h-[180px] rounded-xl shadow-md flex flex-col items-center justify-center cursor-pointer transition hover:shadow-lg hover:-translate-y-1";

  const variants = {
    default: "bg-white text-gray-700",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
  };

  return (
    <div onClick={onClick} className={`${baseStyles} ${variants[variant]}`}>
      <div className="text-4xl mb-3">{icon}</div>
      <h2 className="text-lg font-medium">{title}</h2>
    </div>
  );
}
