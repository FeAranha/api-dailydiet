import { makeCreateMealUseCase } from '@/use-cases/factories/make-create-meal-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub
  console.log('user ID =>', userId)

  const createMealBodySchema = z.object({
    title: z.string(),
    description: z.string(),
    mealDateTime: z.date(),
    isDiet: z.boolean(),
  })

  const { title, description, mealDateTime, isDiet } = createMealBodySchema.parse(request.body)

  const createMealUseCase = makeCreateMealUseCase()

  await createMealUseCase.execute({
    title,
    description,
    mealDateTime,
    isDiet,
    userId: request.user.sub
  })

  return reply.status(201).send()
}