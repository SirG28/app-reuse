import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "default" | "danger";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  label: string;
  variant?: Variant;
};

const VARIANT_CLASS: Record<Variant, string> = {
  default: "text-reuse-text hover:bg-reuse-surface-sunken",
  danger: "text-reuse-danger hover:bg-reuse-status-rejected-bg",
};

export default function IconButton({
  icon,
  label,
  variant = "default",
  className = "",
  type = "button",
  ...rest
}: Props) {
  return (
    <button
      type={type}
      aria-label={label}
      className={`focus-ring flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-150 disabled:opacity-60 ${VARIANT_CLASS[variant]} ${className}`}
      {...rest}
    >
      {icon}
    </button>
  );
}
