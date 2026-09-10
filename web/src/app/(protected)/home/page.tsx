import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import HeaderHome from "@/components/HeaderHome";
import UserSummaryCard from "@/components/UserSummaryCard";
import SectionHeader from "@/components/SectionHeader";
import ShortcutCard from "@/components/ShortcutCard";
import ItemsRow from "@/components/ItemsRow";
import ToastFromQuery from "./ToastFromQuery";

const DOIS_DIAS_MS = 2 * 24 * 60 * 60 * 1000;

// Fora do corpo do componente: o lint de pureza do React não permite chamar
// APIs impuras (Date.now) direto no render de um componente/hook.
function dataLimiteNovidades() {
  return new Date(Date.now() - DOIS_DIAS_MS);
}

export default async function HomePage() {
  const user = await requireSession();

  const [itemCount, itens, novidades, vistos, favoritos] = await Promise.all([
    prisma.item.count({ where: { userId: user.id } }),
    prisma.item.findMany({
      where: { userId: { not: user.id }, status: "DISPONIVEL" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.item.findMany({
      where: {
        userId: { not: user.id },
        status: "DISPONIVEL",
        createdAt: { gte: dataLimiteNovidades() },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.itemView.findMany({
      where: { userId: user.id },
      orderBy: { viewedAt: "desc" },
      take: 10,
      include: { item: true },
    }),
    prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { item: true },
    }),
  ]);

  // Mesma regra de XP do mobile: +50 XP por item publicado (services/itemsService.ts + app/PublicItem.tsx)
  const pontos = itemCount * 50;

  return (
    <div className="animate-page-in">
      <Suspense fallback={null}>
        <ToastFromQuery />
      </Suspense>

      <HeaderHome pontos={pontos} />

      <div className="px-4 pt-3">
        <UserSummaryCard name={user.name} itemCount={itemCount} pontos={pontos} />

        <SectionHeader title="Atalhos" />
        <div className="no-scrollbar mb-[18px] flex gap-2.5 overflow-x-auto pb-1">
          <ShortcutCard
            title="Publicar Item"
            xp="+ 50 XP"
            icon="+"
            href="/items/new"
          />
          <ShortcutCard
            title="Dicas Sustentáveis"
            xp="🌱"
            icon="💡"
            href="/tips"
          />
          <ShortcutCard
            title="Realizar Troca"
            xp="+ 100 XP"
            icon="⇄"
            href="/trocas"
          />
          <ShortcutCard title="Ranking" xp="+ 20 XP" icon="🏆" />
        </div>

        <ItemsRow
          title="Itens para trocar"
          itens={itens}
          actionText="Ver todos"
          actionHref="/items"
          emptyMessage="Nenhum item disponível ainda."
        />

        <ItemsRow title="Novidades" itens={novidades} />

        <ItemsRow
          title="Últimos vistos"
          itens={vistos.map((v) => v.item)}
        />

        <ItemsRow
          title="Seus favoritos"
          itens={favoritos.map((f) => f.item)}
        />
      </div>
    </div>
  );
}
