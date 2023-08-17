import { makeCreateMealUseCase } from '@/use-cases/factories/make-create-meal-use-case'
import { FastifyReply, FastifyRequest} from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createMealBodySchema = z.object({
    title: z.string(),
    description: z.string(),
    mealDateTime: z.date(),
    isDiet: z.boolean(),
    userId: z.string()
  })

  const { title, description, mealDateTime, isDiet, userId } = createMealBodySchema.parse(request.body)

  const createMealUseCase = makeCreateMealUseCase()

  await createMealUseCase.execute({
    title,
    description,
    mealDateTime,
    isDiet,
    userId,
  })

  return reply.status(201).send()
}