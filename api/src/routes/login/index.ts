import bcrypt from 'bcrypt'
import { FastifyInstance } from 'fastify'
import prisma from '../../prisma/prisma'

module.exports = async function (fastify: FastifyInstance) {
  fastify.post('/', async (request, reply) => {
    const { email, password } = request.body as {
      email: string
      password: string
    }

    if (!email) {
      reply.status(400).send({ error: 'Missing username' })
      return
    }

    if (!password) {
      reply.status(400).send({ error: 'Missing password' })
      return
    }

    const db = prisma

    const doctor = await db.doctor.findFirst({
      where: {
        email,
      },
    })

    if (!doctor) {
      return reply.code(404).send({ error: 'Usuario nao encontrado' })
    }

    const passwordMatch = await bcrypt.compare(password, doctor.password)

    if (!passwordMatch) {
      return reply.code(401).send({ error: 'Senha invalida' })
    }

    const doctorMetadata = {
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      licenseId: doctor.licenseId,
      phone: doctor.phone,
    }

    const accessToken = fastify.jwt.sign(doctorMetadata)

    return reply.code(200).send({ accessToken })
  })
}
