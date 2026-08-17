import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  backHref: string;
  onBack?: () => void;
  right?: ReactNode;
};

export default function ScreenHeader({ title, backHref, onBack, right }: Props) {
  return (
    <div className="flex h-14 items-center justify-between border-b border-reuse-header-border px-3">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex w-8 items-center justify-center text-[28px] leading-8 text-reuse-green"
          aria-label="Voltar"
        >
          ‹
        </button>
      ) : (
        <Link
          href={backHref}
          className="flex w-8 items-center justify-center text-[28px] leading-8 text-reuse-green"
          aria-label="Voltar"
        >
          ‹
        </Link>
      )}
      <span className="text-lg font-bold text-reuse-text">{title}</span>
      <div className="flex w-8 items-center justify-center">{right}</div>
    </div>
  );
}
