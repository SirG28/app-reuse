"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";

export async function toggleFavoriteAction(itemId: string) {
  const user = await requireSession();

  const existente = await prisma.favorite.findUnique({
    where: { userId_itemId: { userId: user.id, itemId } },
  });

  if (existente) {
    await prisma.favorite.delete({ where: { id: existente.id } });
  } else {
    await prisma.favorite.create({ data: { userId: user.id, itemId } });
  }

  revalidatePath(`/items/${itemId}`);
  revalidatePath("/home");
}
