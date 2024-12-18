// plugins/protect-routes.ts
import { FastifyInstance, FastifyPluginAsync } from 'fastify'
import { PrismaClient } from '@prisma/client'
import fp from 'fastify-plugin'

const PUBLIC_ROUTES = ['/login']

declare module 'fastify' {
  interface FastifyRequest {
    prisma: PrismaClient
  }
}

const prisma = new PrismaClient()

const protectRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.decorateRequest('prisma', {
    getter() {
      return prisma
    },
  })

  fastify.addHook('onRequest', async (request, reply) => {
    const url = request.url

    if (PUBLIC_ROUTES.some((route) => url.startsWith(route))) {
      return
    }

    await fastify.authenticate(request, reply)
  })
}

export default fp(protectRoutes)
