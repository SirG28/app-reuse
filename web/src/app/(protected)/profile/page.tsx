import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import EditProfileModal from "./EditProfileModal";
import ItemCard from "@/components/ItemCard";
import SectionHeader from "@/components/SectionHeader";

export default async function ProfilePage() {
  const user = await requireSession();
  const inicial = user.name?.charAt(0).toUpperCase() ?? "U";

  const itens = await prisma.item.findMany({
    where: { userId: user.id },
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

  // Mesma regra de XP do mobile: +50 XP por item publicado (services/itemsService.ts + app/PublicItem.tsx)
  const pontos = itens.length * 50;

  return (
    <div className="animate-page-in">
      <div className="flex h-14 items-center justify-between border-b border-reuse-header-border px-4">
        <h1 className="truncate text-lg font-bold text-reuse-text">
          Meu Perfil
        </h1>
        <Link
          href="/settings"
          aria-label="Configurações"
          className="flex h-8 w-8 items-center justify-center text-reuse-text"
        >
          <svg width={20} height={20} viewBox="0 0 16 16" fill="currentColor">
            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
          </svg>
        </Link>
      </div>

      <div className="px-5 pt-4">
        <div className="mb-3.5 flex items-center gap-4">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: "#DCE8C2" }}
          >
            <span className="text-3xl font-bold text-reuse-green-dark">
              {inicial}
            </span>
          </div>

          <div className="flex-1">
            <p className="text-base font-bold text-reuse-text">
              {user.name}
            </p>
            {user.cidade && (
              <p className="mb-1.5 text-xs text-reuse-text-secondary">
                {user.cidade}
                {user.estado ? ` - ${user.estado}` : ""}
              </p>
            )}

            <div className="flex gap-4">
              <p className="text-sm text-reuse-text">
                <span className="font-bold">{itens.length}</span>{" "}
                <span className="text-reuse-text-secondary">itens</span>
              </p>
              <p className="text-sm text-reuse-text">
                <span className="font-bold">{pontos}</span>{" "}
                <span className="text-reuse-text-secondary">XP</span>
              </p>
            </div>
          </div>
        </div>

        <EditProfileModal
          user={{
            name: user.name,
            cep: user.cep,
            cidade: user.cidade,
            estado: user.estado,
          }}
        />
      </div>

      <div className="mt-5 border-t border-reuse-header-border px-4 pt-4">
        <SectionHeader title="Meus Itens" />

        {itens.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <p className="text-[15px] text-reuse-text-secondary">
              Você ainda não publicou nenhum item.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 pb-4">
            {itens.map((item) => (
              <Link key={item.id} href={`/items/${item.id}`} className="block">
                <ItemCard
                  imagem={item.imagem}
                  titulo={item.titulo}
                  descricao={item.descricao}
                  troca={item.troca}
                  categoria={item.categoria}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
