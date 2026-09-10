import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { cancelTradeRequestAction } from "@/app/actions/trades";
import ScreenHeader from "@/components/ScreenHeader";
import SectionHeader from "@/components/SectionHeader";
import TradeRequestActions from "./TradeRequestActions";

export const metadata = {
  title: "Trocas",
};

const ITEM_SELECT = {
  id: true,
  titulo: true,
  imagem: true,
} as const;

const STATUS_LABEL: Record<string, string> = {
  PENDENTE: "Pendente",
  ACEITA: "Aceita",
  RECUSADA: "Recusada",
  CANCELADA: "Cancelada",
};

function statusClass(status: string) {
  if (status === "ACEITA") return "bg-reuse-green-accent/15 text-reuse-green-dark";
  if (status === "PENDENTE") return "bg-reuse-avatar-bg text-reuse-green-dark";
  return "bg-reuse-text-secondary/15 text-reuse-text-secondary";
}

function MiniItem({ item }: { item: { titulo: string; imagem: string | null } }) {
  return (
    <div className="flex flex-1 items-center gap-2 overflow-hidden">
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[#F0F0EE]">
        {item.imagem ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imagem} alt={item.titulo} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-[#E9E9E9]" />
        )}
      </div>
      <p className="truncate text-[13px] font-semibold text-reuse-text">{item.titulo}</p>
    </div>
  );
}

export default async function TrocasPage() {
  const user = await requireSession();

  const [recebidas, enviadas] = await Promise.all([
    prisma.tradeRequest.findMany({
      where: { itemDesejado: { userId: user.id } },
      orderBy: { createdAt: "desc" },
      include: {
        itemDesejado: { select: ITEM_SELECT },
        itemOfertado: { select: ITEM_SELECT },
        solicitante: { select: { name: true } },
      },
    }),
    prisma.tradeRequest.findMany({
      where: { solicitanteId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        itemDesejado: { select: { ...ITEM_SELECT, user: { select: { name: true } } } },
        itemOfertado: { select: ITEM_SELECT },
      },
    }),
  ]);

  return (
    <div className="animate-page-in">
      <ScreenHeader title="Trocas" backHref="/home" />

      <div className="px-4 pt-4">
        <SectionHeader title="Recebidas" />
        {recebidas.length === 0 ? (
          <p className="mb-6 text-sm text-reuse-text-secondary">
            Ninguém solicitou troca pelos seus itens ainda.
          </p>
        ) : (
          <div className="mb-6 flex flex-col gap-3">
            {recebidas.map((solicitacao) => (
              <div
                key={solicitacao.id}
                className="rounded-xl border border-reuse-border bg-white p-3.5"
              >
                <p className="mb-2 text-xs text-reuse-text-secondary">
                  <span className="font-semibold text-reuse-text">
                    {solicitacao.solicitante.name}
                  </span>{" "}
                  quer trocar por:
                </p>
                <div className="mb-2 flex items-center gap-2">
                  <MiniItem item={solicitacao.itemDesejado} />
                  <span className="shrink-0 text-reuse-text-secondary">⇄</span>
                  <MiniItem item={solicitacao.itemOfertado} />
                </div>
                {solicitacao.mensagem && (
                  <p className="mb-2 rounded-lg bg-reuse-bg px-2.5 py-2 text-sm text-reuse-text">
                    &ldquo;{solicitacao.mensagem}&rdquo;
                  </p>
                )}

                {solicitacao.status === "PENDENTE" ? (
                  <TradeRequestActions tradeRequestId={solicitacao.id} />
                ) : (
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusClass(solicitacao.status)}`}
                  >
                    {STATUS_LABEL[solicitacao.status]}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <SectionHeader title="Enviadas" />
        {enviadas.length === 0 ? (
          <p className="mb-6 text-sm text-reuse-text-secondary">
            Você ainda não solicitou nenhuma troca.
          </p>
        ) : (
          <div className="flex flex-col gap-3 pb-4">
            {enviadas.map((solicitacao) => (
              <div
                key={solicitacao.id}
                className="rounded-xl border border-reuse-border bg-white p-3.5"
              >
                <p className="mb-2 text-xs text-reuse-text-secondary">
                  Para{" "}
                  <span className="font-semibold text-reuse-text">
                    {solicitacao.itemDesejado.user.name}
                  </span>
                  , você ofereceu:
                </p>
                <div className="mb-2 flex items-center gap-2">
                  <MiniItem item={solicitacao.itemOfertado} />
                  <span className="shrink-0 text-reuse-text-secondary">⇄</span>
                  <Link href={`/items/${solicitacao.itemDesejado.id}`} className="flex-1">
                    <MiniItem item={solicitacao.itemDesejado} />
                  </Link>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusClass(solicitacao.status)}`}
                  >
                    {STATUS_LABEL[solicitacao.status]}
                  </span>

                  {solicitacao.status === "PENDENTE" && (
                    <form action={cancelTradeRequestAction}>
                      <input type="hidden" name="tradeRequestId" value={solicitacao.id} />
                      <button
                        type="submit"
                        className="text-[13px] font-semibold text-reuse-danger"
                      >
                        Cancelar
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
