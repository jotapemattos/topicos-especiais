import { FastifyInstance } from 'fastify'
import prisma from '../../../prisma/prisma'

module.exports = async function (fastify: FastifyInstance) {
  fastify.post('/', async (request, reply) => {
    const params = request.params as { doctorId: string }
    const { doctorId } = params

    if (!doctorId) {
      reply.status(400).send({ error: 'Parametro doctorId esta faltando' })
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
      patientId,
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
      patientId: string
    }

    const db = prisma
    await db.consultation.create({
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
        patientId,
      },
    })

    return reply.code(201).send({ success: 'Consulta criada com sucesso' })
  })
}
