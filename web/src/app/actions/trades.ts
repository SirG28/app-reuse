"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export type CreateTradeRequestState = { error?: string; success?: boolean } | undefined;

export async function createTradeRequestAction(
  _prevState: CreateTradeRequestState,
  formData: FormData
): Promise<CreateTradeRequestState> {
  const user = await requireSession();

  const itemDesejadoId = String(formData.get("itemDesejadoId") || "");
  const itemOfertadoId = String(formData.get("itemOfertadoId") || "");
  const mensagem = String(formData.get("mensagem") || "").trim() || null;

  if (!itemOfertadoId) {
    return { error: "Escolha um item seu para oferecer na troca." };
  }

  const [itemDesejado, itemOfertado] = await Promise.all([
    prisma.item.findUnique({ where: { id: itemDesejadoId } }),
    prisma.item.findUnique({ where: { id: itemOfertadoId } }),
  ]);

  if (!itemDesejado || itemDesejado.status !== "DISPONIVEL") {
    return { error: "Este item não está mais disponível." };
  }
  if (itemDesejado.userId === user.id) {
    return { error: "Você não pode solicitar troca pelo seu próprio item." };
  }
  if (!itemOfertado || itemOfertado.userId !== user.id) {
    return { error: "Escolha um item que pertence a você." };
  }
  if (itemOfertado.status !== "DISPONIVEL") {
    return { error: "O item que você quer oferecer não está mais disponível." };
  }

  const jaExiste = await prisma.tradeRequest.findFirst({
    where: {
      itemDesejadoId,
      solicitanteId: user.id,
      status: "PENDENTE",
    },
  });
  if (jaExiste) {
    return { error: "Você já tem uma solicitação pendente para este item." };
  }

  await prisma.tradeRequest.create({
    data: {
      itemDesejadoId,
      itemOfertadoId,
      solicitanteId: user.id,
      mensagem,
    },
  });

  revalidatePath(`/items/${itemDesejadoId}`);
  revalidatePath("/trocas");

  return { success: true };
}

async function carregarSolicitacaoComoDono(tradeRequestId: string, userId: string) {
  const solicitacao = await prisma.tradeRequest.findUnique({
    where: { id: tradeRequestId },
    include: { itemDesejado: true, itemOfertado: true },
  });

  if (!solicitacao || solicitacao.itemDesejado.userId !== userId) {
    return null;
  }
  return solicitacao;
}

export async function acceptTradeRequestAction(formData: FormData) {
  const user = await requireSession();
  const tradeRequestId = String(formData.get("tradeRequestId") || "");

  const solicitacao = await carregarSolicitacaoComoDono(tradeRequestId, user.id);
  if (!solicitacao || solicitacao.status !== "PENDENTE") {
    return;
  }

  const idsEnvolvidos = [solicitacao.itemDesejadoId, solicitacao.itemOfertadoId];

  await prisma.$transaction([
    prisma.tradeRequest.update({
      where: { id: solicitacao.id },
      data: { status: "ACEITA" },
    }),
    prisma.item.updateMany({
      where: { id: { in: idsEnvolvidos } },
      data: { status: "TROCADO" },
    }),
    // Qualquer outro pedido pendente envolvendo qualquer um dos dois itens
    // não faz mais sentido — os itens acabaram de ser trocados.
    prisma.tradeRequest.updateMany({
      where: {
        id: { not: solicitacao.id },
        status: "PENDENTE",
        OR: [
          { itemDesejadoId: { in: idsEnvolvidos } },
          { itemOfertadoId: { in: idsEnvolvidos } },
        ],
      },
      data: { status: "RECUSADA" },
    }),
  ]);

  revalidatePath("/trocas");
  revalidatePath("/home");
  revalidatePath("/items");
  revalidatePath(`/items/${solicitacao.itemDesejadoId}`);
  revalidatePath(`/items/${solicitacao.itemOfertadoId}`);
}

export async function declineTradeRequestAction(formData: FormData) {
  const user = await requireSession();
  const tradeRequestId = String(formData.get("tradeRequestId") || "");

  const solicitacao = await carregarSolicitacaoComoDono(tradeRequestId, user.id);
  if (!solicitacao || solicitacao.status !== "PENDENTE") {
    return;
  }

  await prisma.tradeRequest.update({
    where: { id: solicitacao.id },
    data: { status: "RECUSADA" },
  });

  revalidatePath("/trocas");
}

export async function cancelTradeRequestAction(formData: FormData) {
  const user = await requireSession();
  const tradeRequestId = String(formData.get("tradeRequestId") || "");

  const solicitacao = await prisma.tradeRequest.findUnique({
    where: { id: tradeRequestId },
  });
  if (
    !solicitacao ||
    solicitacao.solicitanteId !== user.id ||
    solicitacao.status !== "PENDENTE"
  ) {
    return;
  }

  await prisma.tradeRequest.update({
    where: { id: solicitacao.id },
    data: { status: "CANCELADA" },
  });

  revalidatePath("/trocas");
}
