import { FastifyInstance } from 'fastify'
import prisma from '../../../prisma/prisma'

module.exports = async function (fastify: FastifyInstance) {
  fastify.post('/', async (request, reply) => {
    const params = request.params as { doctorId: string }
    const { doctorId } = params

    if (!doctorId) {
      reply.status(400).send({ error: 'Parametro doctorId esta faltando' })
    }
    const { name, cpf, birthDate, motherName } = request.body as {
      name: string
      cpf: string
      birthDate: string
      motherName: string
    }

    const db = prisma
    await db.patient.create({
      data: {
        name,
        cpf,
        birthDate: new Date(birthDate),
        motherName,
        doctorId,
      },
    })
    return reply.code(201).send({ success: 'Paciente Cadastrado' })
  })
  fastify.get('/', async (request, reply) => {
    const params = request.params as { doctorId: string }
    const { doctorId } = params

    if (!doctorId) {
      reply.status(400).send({ error: 'Parametro doctorId esta faltando' })
    }
    const db = prisma

    const patients = await db.patient.findMany({
      where: {
        doctorId,
      },
      include: {
        consultations: {
          where: {
            doctorId,
          },
        },
      },
    })
    return reply.code(200).send({ patients })
  })
}
