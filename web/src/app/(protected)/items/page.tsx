import type { Categoria } from "@prisma/client";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import ItemCard from "@/components/ItemCard";
import ScreenHeader from "@/components/ScreenHeader";
import { CATEGORIAS, categoriaLabel } from "@/lib/categorias";

export const metadata = {
  title: "Todos os itens",
};

function chipClass(ativo: boolean) {
  return `shrink-0 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold ${
    ativo
      ? "border-reuse-green-dark bg-reuse-green-dark text-white"
      : "border-reuse-border text-reuse-text-secondary"
  }`;
}

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
        <Link href="/items" className={chipClass(!categoriaAtiva)}>
          Todos
        </Link>
        {CATEGORIAS.map((c) => (
          <Link
            key={c.value}
            href={`/items?categoria=${c.value}`}
            className={chipClass(categoriaAtiva === c.value)}
          >
            {c.label}
          </Link>
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
          <div className="grid grid-cols-2 gap-3 pb-6">
            {itens.map((item) => (
              <Link key={item.id} href={`/items/${item.id}`} className="block">
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
