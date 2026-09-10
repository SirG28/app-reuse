"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import IconButton from "@/components/IconButton";
import Logo from "@/components/Logo";
import MobileNavDrawer from "@/components/MobileNavDrawer";
import { NAV_ITEMS } from "@/lib/navItems";

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

type Props = {
  userName: string;
  userCidade: string | null;
  userEstado: string | null;
  logoutAction: (formData: FormData) => void | Promise<void>;
};

export default function SiteHeader({ userName, userCidade, userEstado, logoutAction }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  function navLinkClass(href: string) {
    return `focus-ring rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
      isActive(href)
        ? "bg-reuse-green-accent text-white"
        : "text-reuse-text-secondary hover:bg-reuse-surface-sunken"
    }`;
  }

  const localizacao = userCidade ? `${userCidade}${userEstado ? ` - ${userEstado}` : ""}` : null;

  return (
    <>
      <header className="sticky top-0 z-30">
        {/* Faixa utilitária: só desktop — no mobile, localização/Dicas/Ranking
            vivem no drawer, pra não empilhar mais uma barra na tela pequena. */}
        <div className="hidden bg-reuse-green-dark md:block">
          <div className="mx-auto flex h-9 w-full max-w-5xl items-center justify-between px-4 text-xs font-medium text-white/90">
            <span>📍 {localizacao ? `Trocas perto de ${localizacao}` : "Trocas sustentáveis no Brasil todo"}</span>
            <div className="flex items-center gap-4">
              <Link href="/tips" className="focus-ring rounded hover:text-white hover:underline">
                Dicas sustentáveis
              </Link>
              <span className="cursor-default text-white/50">Ranking</span>
            </div>
          </div>
        </div>

        <div className="border-b border-reuse-header-border bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
            <Link href="/home" className="shrink-0">
              <Logo size={30} />
            </Link>

            <nav className="hidden items-center gap-1 md:flex">
              {NAV_ITEMS.map((item) => (
                <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/items/new"
                className="focus-ring rounded-lg bg-reuse-green-dark px-4 py-2 text-[13px] font-bold text-white transition duration-150 hover:brightness-95 active:scale-[0.97]"
              >
                + Publicar item
              </Link>
              <Link href="/settings">
                <IconButton icon={<GearIcon />} label="Configurações" />
              </Link>
            </div>

            <IconButton
              icon={open ? <BurgerIconClose /> : <BurgerIcon />}
              label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="md:hidden"
            />
          </div>
        </div>
      </header>

      {/* Fora do <header>: backdrop-filter (backdrop-blur) no header cria um
          containing block para descendentes `fixed`, o que prenderia o
          drawer dentro da altura de 64px do header em vez do viewport. */}
      <MobileNavDrawer
        open={open}
        onClose={() => setOpen(false)}
        userName={userName}
        userCidade={userCidade}
        userEstado={userEstado}
        isActive={isActive}
        logoutAction={logoutAction}
      />
    </>
  );
}

function BurgerIconClose() {
  return (
    <svg width={20} height={20} viewBox="0 0 16 16" fill="currentColor">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
    </svg>
  );
}
