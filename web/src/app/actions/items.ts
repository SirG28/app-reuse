"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export type CreateItemState = { error?: string } | undefined;

export async function createItemAction(
  _prevState: CreateItemState,
  formData: FormData
): Promise<CreateItemState> {
  const user = await requireSession();

  const titulo = String(formData.get("titulo") || "").trim();
  const descricao = String(formData.get("descricao") || "").trim();
  const troca = String(formData.get("troca") || "").trim();
  const whatsapp = String(formData.get("whatsapp") || "").trim();
  const imagem = String(formData.get("imagem") || "").trim() || null;

  if (!titulo || !descricao || !troca || !whatsapp) {
    return {
      error: "Preencha pelo menos título, descrição, troca e WhatsApp.",
    };
  }

  await prisma.item.create({
    data: {
      titulo,
      descricao,
      troca,
      whatsapp,
      imagem,
      userId: user.id,
    },
  });

  redirect("/home");
}
