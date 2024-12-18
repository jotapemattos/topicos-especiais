import bcrypt from 'bcrypt'
import prisma from '../prisma/prisma'

export async function seed() {
  await prisma.doctor.deleteMany()
  const password = await bcrypt.hash('senha123', 6)

  await prisma.doctor.create({
    data: {
      email: 'doutorfulano@email.com',
      name: 'Fulano da Silva',
      licenseId: 'CRM-21843249',
      phone: '(11) 99999-9999',
      password,
    },
  })
}
