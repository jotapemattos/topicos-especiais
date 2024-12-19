import { FastifyInstance } from 'fastify'
import prisma from '../../../../prisma/prisma'

module.exports = async function (fastify: FastifyInstance) {
  fastify.delete('/', async (request, reply) => {
    const params = request.params as {
      doctorId: string
      consultationId: string
    }
    const { doctorId, consultationId } = params

    if (!doctorId) {
      reply.status(400).send({ error: 'Parametro doctorId esta faltando' })
    }

    if (!consultationId) {
      reply
        .status(400)
        .send({ error: 'Parametro consultationId esta faltando' })
    }

    const db = prisma
    await db.consultation.delete({
      where: {
        id: consultationId,
        doctorId,
      },
    })
    return reply.code(200).send({ success: 'Consulta deletada com sucesso' })
  })
  fastify.put('/', async (request, reply) => {
    const params = request.params as {
      doctorId: string
      consultationId: string
    }
    const { doctorId, consultationId } = params

    if (!doctorId) {
      reply.status(400).send({ error: 'Parametro doctorId esta faltando' })
    }

    if (!consultationId) {
      reply
        .status(400)
        .send({ error: 'Parametro consultationId esta faltando' })
    }

    const {
      anamnesis,
      bloodPressure,
      icdCode,
      consultDate,
      duration,
      frequency,
      glycemia,
      medication,
      saturation,
      time,
    } = request.body as {
      bloodPressure: string
      icdCode: string
      glycemia: string
      duration: string
      anamnesis: string
      medication: string
      consultDate: string
      time: string
      saturation: string
      frequency: string
    }

    const db = prisma
    await db.consultation.update({
      data: {
        anamnesis,
        bloodPressure,
        consultDate: new Date(consultDate),
        duration: Number(duration),
        frequency,
        glycemia: Number(glycemia),
        icdCode,
        medication,
        saturation: Number(saturation),
        time,
        doctorId,
      },
      where: {
        id: consultationId,
        doctorId,
      },
    })
    return reply.code(200).send({ success: 'Paciente editado com sucesso' })
  })
}
