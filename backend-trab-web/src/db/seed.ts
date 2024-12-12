import prisma from "../prisma/prisma";
import bcrypt from "bcrypt";

export async function seed() {
  const count = await prisma.doctor.findFirst({
    where: {
      email: 'doutorfulano@email.com'
    }
  })
  if(count){
    await prisma.doctor.delete({ where: { email: "doutorfulano@email.com" } });
  }
  const password = await bcrypt.hash("senha123", 6);

  await prisma.doctor.create({
    data: {
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
