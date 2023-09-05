import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeUpdateMealUseCase } from '@/use-cases/factories/make-update-use-case'

export async function updateMeal(request: FastifyRequest, reply: FastifyReply) {
  try {
    const updateMealParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = updateMealParamsSchema.parse(request.params)
    
    const updateMealUseCase = makeUpdateMealUseCase();
    
    const userId = request.user.sub
    
    const updateMealBodySchema = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      mealDateTime: z.date().optional(),
      isDiet: z.boolean().optional(),
    })

    const {
      title,
      description,
      mealDateTime,
      isDiet,
    } = updateMealBodySchema.parse(request.body);
    
    const updatedMeal = await updateMealUseCase.execute({
      userId,
      id,
      title,
      description,
      mealDateTime,
      isDiet,
    });

    if (!updatedMeal.success) {
      return reply.status(404).send(updatedMeal.message);
    }

    return reply.status(200).send(updatedMeal.meal);
  } catch (error) {
    console.error('error updating meal', error)
    return reply.status(500).send('An error occurred while updating the meal.')
  }
}