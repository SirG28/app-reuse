import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const senhaHash = await bcrypt.hash("reuse123", 10);

  const ana = await prisma.user.upsert({
    where: { email: "ana@reuse.com" },
    update: {},
    create: {
      name: "Ana Carolina",
      email: "ana@reuse.com",
      passwordHash: senhaHash,
      cep: "01310100",
      cidade: "São Paulo",
      estado: "SP",
    },
  });

  const bruno = await prisma.user.upsert({
    where: { email: "bruno@reuse.com" },
    update: {},
    create: {
      name: "Bruno Ferreira",
      email: "bruno@reuse.com",
      passwordHash: senhaHash,
      cep: "20040020",
      cidade: "Rio de Janeiro",
      estado: "RJ",
    },
  });

  await prisma.item.createMany({
    data: [
      {
        titulo: "Quadro decorativo",
        descricao: "32cm x 24cm, moldura de madeira e pintura em acrílico.",
        troca: "Quadros semelhantes ou outras decorações de parede",
        whatsapp: "(11) 91234-5678",
        imagem: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600",
        userId: ana.id,
      },
      {
        titulo: "Bicicleta aro 26",
        descricao: "Usada, bom estado, poucos arranhões na pintura.",
        troca: "Skate ou patins em bom estado",
        whatsapp: "(21) 99876-5432",
        imagem: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600",
        userId: bruno.id,
      },
      {
        titulo: "Coleção de livros de ficção",
        descricao: "12 livros, capa comum, leitura única.",
        troca: "Outros livros ou HQs",
        whatsapp: "(11) 95555-1212",
        imagem: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600",
        userId: ana.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed concluído: 2 usuários e itens de demonstração criados.");
  console.log("Login de teste: ana@reuse.com / bruno@reuse.com — senha: reuse123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
