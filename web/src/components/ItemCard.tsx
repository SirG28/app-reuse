type Props = {
  imagem?: string | null;
  titulo: string;
  descricao: string;
  troca: string;
};

export default function ItemCard({ imagem, titulo, descricao, troca }: Props) {
  return (
    <div className="w-[170px] shrink-0 overflow-hidden rounded-xl border border-[#E2DED6] bg-white">
      <div className="h-[110px] w-full bg-[#F0F0EE]">
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
