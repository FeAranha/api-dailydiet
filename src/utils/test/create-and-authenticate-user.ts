import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  const createUserResponse = await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '123456',
  });

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  })

  const { token } = authResponse.body
console.log('token =>>', token)
  const me = await request(app.server)
    .get('/me')
    .set('Authorization', `Bearer ${token}`)

  const user_id = me.body.user.id

  console.log('quero: =>', user_id)
  return {
    token,
    user: createUserResponse.body,
    user_id,
  }
}