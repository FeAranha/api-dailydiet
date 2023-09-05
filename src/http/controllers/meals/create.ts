import { makeCreateMealUseCase } from '@/use-cases/factories/make-create-meal-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  try {
    const createMealBodySchema = z.object({
      title: z.string(),
      description: z.string(),
      isDiet: z.boolean(),
    })

    const { title, description, isDiet } = createMealBodySchema.parse(request.body)

    const createMealUseCase = makeCreateMealUseCase()

    await createMealUseCase.execute({
      title,
      description,
      isDiet,
      userId: request.user.sub
    })
    
    return reply.status(201).send();
  } catch (error) {
    console.error('Error creating meal:', error);
    return reply.status(500).send('An error occurred while creating the meal.');
  }
}
