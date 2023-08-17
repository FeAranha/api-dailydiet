import { FastifyInstance } from 'fastify'
import { register } from '@/http/controllers/users/register'
import { authenticate } from './authenticate'
import { profile } from './profile'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.get('/me', profile)
}