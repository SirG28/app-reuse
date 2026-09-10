"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type NavItem = { href: string; label: string };

const NAV_ITEMS: NavItem[] = [
  { href: "/home", label: "Início" },
  { href: "/items", label: "Itens" },
  { href: "/trocas", label: "Trocas" },
  { href: "/profile", label: "Perfil" },
];

function GearIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 16 16" fill="currentColor">
      <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
    </svg>
  );
}

function BurgerIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 16 16" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 16 16" fill="currentColor">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
    </svg>
  );
}

type Props = {
  logoutAction: (formData: FormData) => void | Promise<void>;
};

export default function SiteHeader({ logoutAction }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function navLinkClass(href: string) {
    return `rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
      isActive(href)
        ? "bg-reuse-green-accent text-white"
        : "text-reuse-text-secondary hover:bg-[#F0F0EE]"
    }`;
  }

  return (
    <header className="sticky top-0 z-30 border-b border-reuse-header-border bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
        <Link href="/home" className="shrink-0 text-xl font-extrabold tracking-tight">
          <span className="text-reuse-text">Re</span>
          <span className="text-reuse-green">Use</span>
          <span className="text-reuse-green-dark">!</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
              {item.label}
            </Link>
          ))}
          <span className="ml-1 cursor-default rounded-full px-3.5 py-1.5 text-sm font-semibold text-[#B9B6AC]">
            Ranking
          </span>
          <Link
            href="/settings"
            aria-label="Configurações"
            className="ml-2 flex h-9 w-9 items-center justify-center rounded-full text-reuse-text hover:bg-[#F0F0EE]"
          >
            <GearIcon />
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center text-reuse-text md:hidden"
        >
          {open ? <CloseIcon /> : <BurgerIcon />}
        </button>
      </div>

      {open && (
        <div className="border-t border-reuse-header-border bg-white px-4 pb-3 pt-1 md:hidden">
          <nav className="flex flex-col">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-2.5 py-2.5 text-[15px] font-semibold ${
                  isActive(item.href) ? "text-reuse-green-dark" : "text-reuse-text"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <span className="cursor-default rounded-lg px-2.5 py-2.5 text-[15px] font-semibold text-[#B9B6AC]">
              Ranking
            </span>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2.5 py-2.5 text-[15px] font-semibold text-reuse-text"
            >
              Configurações
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full rounded-lg px-2.5 py-2.5 text-left text-[15px] font-semibold text-red-600"
              >
                Sair da conta
              </button>
            </form>
          </nav>
        </div>
      )}
    </header>
  );
}
