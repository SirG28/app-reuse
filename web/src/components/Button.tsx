import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "md" | "sm";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
};

const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    "bg-reuse-green-dark text-white hover:brightness-95 disabled:hover:brightness-100",
  secondary:
    "border border-reuse-green-dark text-reuse-green-dark hover:bg-reuse-green-dark hover:text-white",
  danger:
    "border border-reuse-danger text-reuse-danger hover:bg-reuse-danger hover:text-white",
  ghost:
    "border border-reuse-neutral-300 text-reuse-neutral-500 hover:bg-reuse-surface-sunken",
};

const SIZE_CLASS: Record<Size, string> = {
  md: "rounded-xl py-3 text-lg font-bold",
  sm: "rounded-lg px-4 py-2 text-[13px] font-bold",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth,
  className = "",
  type = "button",
  ...rest
}: Props) {
  const isFullWidth = fullWidth ?? size === "md";

  return (
    <button
      type={type}
      className={`focus-ring transition duration-150 active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100 ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${isFullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
