import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import ItemComments from "@/components/ItemComments";
import ItemOwnerPanel from "./ItemOwnerPanel";
import ItemDetailHeader from "./ItemDetailHeader";
import FavoriteButton from "./FavoriteButton";
import TradeRequestButton from "./TradeRequestButton";
import { categoriaLabel } from "@/lib/categorias";
import { recordItemView } from "@/lib/interactions";

type Params = { id: string };

async function getItem(id: string) {
  return prisma.item.findUnique({
    where: { id },
    include: { user: { select: { name: true } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await getItem(id);

  if (!item) {
    return { title: "Item não encontrado" };
  }

  return {
    title: item.titulo,
    description: item.descricao,
  };
}

export default async function ItemDetailsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const [user, item] = await Promise.all([requireSession(), getItem(id)]);

  if (!item) {
    notFound();
  }

  const isOwner = item.userId === user.id;

  let isFavorited = false;
  let meusItensDisponiveis: { id: string; titulo: string; imagem: string | null }[] = [];
  let solicitacaoPendente = false;

  if (!isOwner) {
    const [, favorito, meusItens, pendente] = await Promise.all([
      recordItemView(user.id, item.id),
      prisma.favorite.findUnique({
        where: { userId_itemId: { userId: user.id, itemId: item.id } },
      }),
      prisma.item.findMany({
        where: { userId: user.id, status: "DISPONIVEL" },
        select: { id: true, titulo: true, imagem: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.tradeRequest.findFirst({
        where: { itemDesejadoId: item.id, solicitanteId: user.id, status: "PENDENTE" },
      }),
    ]);
    isFavorited = !!favorito;
    meusItensDisponiveis = meusItens;
    solicitacaoPendente = !!pendente;
  }

  return (
    <div className="animate-page-in">
      <ItemDetailHeader
        title={item.titulo}
        fallbackHref={isOwner ? "/profile" : "/home"}
      />

      <div className="px-4 pt-4">
        <div className="mb-4 h-56 w-full overflow-hidden rounded-xl bg-[#F0F0EE]">
          {item.imagem ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imagem}
              alt={item.titulo}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-[#E9E9E9]" />
          )}
        </div>

        <div className="mb-1.5 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-block w-fit rounded-full bg-reuse-avatar-bg px-2.5 py-0.5 text-[11px] font-semibold text-reuse-green-dark">
              {categoriaLabel(item.categoria)}
            </span>
            {item.status === "TROCADO" && (
              <span className="inline-block w-fit rounded-full bg-reuse-text-secondary/20 px-2.5 py-0.5 text-[11px] font-semibold text-reuse-text-secondary">
                Trocado
              </span>
            )}
          </div>
          {!isOwner && (
            <FavoriteButton itemId={item.id} favoritadoInicialmente={isFavorited} />
          )}
        </div>
        <p className="mb-1.5 text-xl font-bold text-reuse-text">
          {item.titulo}
        </p>
        <p className="mb-3 text-sm leading-relaxed text-reuse-text-secondary">
          {item.descricao}
        </p>
        <p className="mb-4 text-[13px] font-semibold text-reuse-green-accent">
          Troca por: {item.troca}
        </p>

        {isOwner ? (
          <ItemOwnerPanel
            item={{
              id: item.id,
              titulo: item.titulo,
              descricao: item.descricao,
              troca: item.troca,
              imagem: item.imagem,
              categoria: item.categoria,
            }}
          />
        ) : (
          <div className="mb-6 rounded-xl border border-reuse-border bg-white p-3.5">
            <p className="mb-1 text-sm text-reuse-text-secondary">
              Publicado por{" "}
              <span className="font-semibold text-reuse-text">
                {item.user.name}
              </span>
            </p>
            <p className="text-sm text-reuse-text-secondary">
              WhatsApp:{" "}
              <span className="text-reuse-text">{item.whatsapp}</span>
            </p>
          </div>
        )}

        {!isOwner && item.status === "DISPONIVEL" && (
          <div className="mb-6">
            <TradeRequestButton
              itemDesejadoId={item.id}
              meusItensDisponiveis={meusItensDisponiveis}
              solicitacaoPendente={solicitacaoPendente}
            />
          </div>
        )}

        <ItemComments itemId={item.id} isOwner={isOwner} />
      </div>
    </div>
  );
}
