import type { Categoria } from "@prisma/client";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import Chip from "@/components/Chip";
import ItemCard from "@/components/ItemCard";
import ScreenHeader from "@/components/ScreenHeader";
import { CATEGORIAS, categoriaLabel } from "@/lib/categorias";

export const metadata = {
  title: "Todos os itens",
};

export default async function AllItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const user = await requireSession();
  const { categoria } = await searchParams;

  // Só aceita valores reais do enum — qualquer outra coisa na query string
  // (ou nenhuma) cai no "Todos", sem filtro.
  const categoriaAtiva = CATEGORIAS.find((c) => c.value === categoria)?.value;

  const itens = await prisma.item.findMany({
    where: {
      userId: { not: user.id },
      status: "DISPONIVEL",
      ...(categoriaAtiva ? { categoria: categoriaAtiva as Categoria } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      titulo: true,
      descricao: true,
      troca: true,
      imagem: true,
      categoria: true,
    },
  });

  return (
    <div className="animate-page-in">
      <ScreenHeader title="Todos os itens" backHref="/home" />

      <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-1 pt-4">
        <Chip active={!categoriaAtiva} href="/items">
          Todos
        </Chip>
        {CATEGORIAS.map((c) => (
          <Chip
            key={c.value}
            active={categoriaAtiva === c.value}
            href={`/items?categoria=${c.value}`}
          >
            {c.label}
          </Chip>
        ))}
      </div>

      <div className="px-4 pt-3">
        {itens.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <p className="text-[15px] text-reuse-text-secondary">
              {categoriaAtiva
                ? `Nenhum item em "${categoriaLabel(categoriaAtiva)}" no momento.`
                : "Nenhum item disponível no momento."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-6 sm:grid-cols-3 lg:grid-cols-4">
            {itens.map((item) => (
              <Link key={item.id} href={`/items/${item.id}`} className="focus-ring block rounded-xl">
                <ItemCard
                  imagem={item.imagem}
                  titulo={item.titulo}
                  descricao={item.descricao}
                  troca={item.troca}
                  categoria={item.categoria}
                  variant="fluid"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
