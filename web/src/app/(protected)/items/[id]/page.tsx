import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import ItemComments from "@/components/ItemComments";
import ItemOwnerPanel from "./ItemOwnerPanel";
import ItemDetailHeader from "./ItemDetailHeader";

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

        <ItemComments itemId={item.id} isOwner={isOwner} />
      </div>
    </div>
  );
}
