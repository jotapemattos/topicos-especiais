import prisma from "../prisma/prisma";
import bcrypt from "bcrypt";

export async function seed() {
  const password = await bcrypt.hash("senha123", 6);

  await prisma.doctor.upsert({
    where: {
      email: "doutorfulano@email.com"
    },
    update: {
      name: "Fulano da Silva",
      licenseId: "CRM-21843249",
      phone: "(11) 99999-9999",
      password,
    },
    create: {
      email: "doutorfulano@email.com",
      name: "Fulano da Silva",
      licenseId: "CRM-21843249",
      phone: "(11) 99999-9999",
      password,
    },
  });
}

seed().finally(() => {
  prisma.$disconnect();
});
