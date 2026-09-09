import type { Categoria } from "@prisma/client";
import { categoriaLabel } from "@/lib/categorias";

type Props = {
  imagem?: string | null;
  titulo: string;
  descricao: string;
  troca: string;
  categoria?: Categoria;
};

export default function ItemCard({
  imagem,
  titulo,
  descricao,
  troca,
  categoria,
}: Props) {
  return (
    <div className="h-[210px] w-[170px] shrink-0 overflow-hidden rounded-xl border border-[#E2DED6] bg-white">
      <div className="relative h-[110px] w-full bg-[#F0F0EE]">
        {imagem ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagem}
            alt={titulo}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[#E9E9E9]" />
        )}

        {categoria && (
          <span className="absolute left-1.5 top-1.5 truncate rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-semibold text-reuse-green-dark shadow-sm">
            {categoriaLabel(categoria)}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 p-2.5">
        <p className="truncate text-[13px] font-bold text-reuse-text">
          {titulo || "Sem título"}
        </p>
        <p className="line-clamp-2 text-xs leading-4 text-reuse-text-secondary">
          {descricao || "Sem descrição"}
        </p>
        <p className="mt-0.5 truncate text-[11px] font-semibold text-reuse-green-accent">
          Troca por: {troca || "-"}
        </p>
      </div>
    </div>
  );
}
