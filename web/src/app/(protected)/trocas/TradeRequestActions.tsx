"use client";

import { useState } from "react";
import { acceptTradeRequestAction, declineTradeRequestAction } from "@/app/actions/trades";

export default function TradeRequestActions({
  tradeRequestId,
}: {
  tradeRequestId: string;
}) {
  const [enviando, setEnviando] = useState<"aceitar" | "recusar" | null>(null);

  return (
    <div className="flex gap-2.5">
      <form
        action={declineTradeRequestAction}
        onSubmit={() => setEnviando("recusar")}
        className="flex-1"
      >
        <input type="hidden" name="tradeRequestId" value={tradeRequestId} />
        <button
          type="submit"
          disabled={enviando !== null}
          className="w-full rounded-lg border border-reuse-danger py-2 text-[13px] font-semibold text-reuse-danger disabled:opacity-60"
        >
          {enviando === "recusar" ? "Recusando..." : "Recusar"}
        </button>
      </form>
      <form
        action={acceptTradeRequestAction}
        onSubmit={() => setEnviando("aceitar")}
        className="flex-1"
      >
        <input type="hidden" name="tradeRequestId" value={tradeRequestId} />
        <button
          type="submit"
          disabled={enviando !== null}
          className="w-full rounded-lg bg-reuse-green-accent py-2 text-[13px] font-bold text-white disabled:opacity-60"
        >
          {enviando === "aceitar" ? "Aceitando..." : "Aceitar"}
        </button>
      </form>
    </div>
  );
}
