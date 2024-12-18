import { FastifyInstance } from 'fastify'
import prisma from '../../../../prisma/prisma'

module.exports = async function (fastify: FastifyInstance) {
  fastify.delete('/', async (request, reply) => {
    const params = request.params as { doctorId: string; patientId: string }
    const { doctorId, patientId } = params

    if (!doctorId) {
      reply.status(400).send({ error: 'Parametro doctorId esta faltando' })
    }

    if (!patientId) {
      reply.status(400).send({ error: 'Parametro patientId esta faltando' })
    }

    const db = prisma
    await db.patient.delete({
      where: {
        id: patientId,
        doctorId,
      },
    })
    return reply.code(200).send({ success: 'Paciente deletado com sucesso' })
  })
  fastify.put('/', async (request, reply) => {
    const params = request.params as { doctorId: string; patientId: string }
    const { doctorId, patientId } = params

    if (!doctorId) {
      reply.status(400).send({ error: 'Parametro doctorId esta faltando' })
    }

    if (!patientId) {
      reply.status(400).send({ error: 'Parametro patientId esta faltando' })
    }

    const { name, cpf, birthDate, motherName } = request.body as {
      name: string
      cpf: string
      birthDate: string
      motherName: string
    }

    const db = prisma
    await db.patient.update({
      data: {
        name,
        cpf,
        birthDate: new Date(birthDate),
        motherName,
      },
      where: {
        id: patientId,
        doctorId,
      },
    })
    return reply.code(200).send({ success: 'Paciente editado com sucesso' })
  })
}
