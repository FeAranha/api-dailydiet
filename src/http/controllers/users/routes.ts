import { FastifyInstance } from 'fastify'
import { register } from '@/http/controllers/users/register'
import { authenticate } from './authenticate'
import { profile } from './profile'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { refresh } from './refresh'
import {}  from './metrics'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.get('/me', { onRequest: [verifyJwt] }, profile)
  app.patch('/token/refresh', refresh)
}