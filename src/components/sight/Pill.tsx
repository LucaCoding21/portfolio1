const BASE =
  "inline-flex items-center justify-center rounded-full font-medium transition-colors duration-200";

const VARIANTS = {
  primary: "bg-[var(--blue)] text-white hover:bg-[var(--blue-deep)]",
  secondary:
    "bg-white text-[var(--ink)] border border-[var(--line)] hover:border-[#DADCE0] hover:bg-[var(--surface-2)]",
};

export default function Pill({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
}: {
  href: string;
  variant?: keyof typeof VARIANTS;
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
}) {
  const pad = size === "sm" ? "px-5 py-2.5 text-[0.875rem]" : "px-7 py-3.5 text-[0.95rem]";
  return (
    <a href={href} className={`${BASE} ${VARIANTS[variant]} ${pad} ${className}`}>
      {children}
    </a>
  );
}
