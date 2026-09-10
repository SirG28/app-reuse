import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-reuse-header-border">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-2 px-4 py-6 text-center md:flex-row md:justify-between md:text-left">
        <span className="text-base font-extrabold tracking-tight">
          <span className="text-reuse-text">Re</span>
          <span className="text-reuse-green">Use</span>
          <span className="text-reuse-green-dark">!</span>
        </span>
        <p className="text-xs text-reuse-text-secondary">
          Dando uma segunda vida aos seus objetos.
        </p>
        <Link
          href="/tips"
          className="text-xs font-semibold text-reuse-green-dark hover:underline"
        >
          Dicas sustentáveis
        </Link>
        <span className="text-xs text-reuse-text-secondary">© ReUse!</span>
      </div>
    </footer>
  );
}
