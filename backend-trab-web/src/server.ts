import autoload from '@fastify/autoload'
import 'dotenv/config'
import Fastify from 'fastify'
import path from 'path'
import prisma from './prisma/prisma'
import { seed } from './db/seed'
import cors from '@fastify/cors'

const fastify = Fastify()

async function initializeDatabase() {
  try {
      console.log('🌱 Seeding database...')
      await seed()
  } catch (error) {
    console.error('Error during database initialization:', error)
  }
}

fastify.register(autoload, {
  dir: path.join(__dirname, 'plugins'),
  autoHooks: true,
})

fastify.register(cors, {
  origin: ['http://localhost:3000', 'http://localhost'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  preflight: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
})

fastify.register(autoload, {
  dir: path.join(__dirname, 'routes'),
})

fastify.addHook('onClose', async () => {
  await prisma.$disconnect()
})

const PORT = 3333
fastify.listen({ host: '0.0.0.0', port: PORT }, async function (err) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`🎉 Server is up and running at port ${PORT}`)
  
  await initializeDatabase()
})
