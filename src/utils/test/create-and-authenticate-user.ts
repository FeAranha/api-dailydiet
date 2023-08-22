import { FastifyInstance } from 'fastify'
import request from 'supertest'
import jwt from 'jsonwebtoken';

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
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
  const decodedToken = jwt.decode(token)

  if (!decodedToken || typeof decodedToken != 'object') {
    throw new Error('Invalid token or decoding error')
  }

  const user_id = decodedToken.sub

  console.log('quero: =>', user_id)
  return {
    token,
    user_id,
  }
}