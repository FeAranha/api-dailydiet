import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeUpdateMealUseCase } from '@/use-cases/factories/make-update-use-case'

export async function updateMeal(request: FastifyRequest, reply: FastifyReply) {
  try {
    const updateMealParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = updateMealParamsSchema.parse(request.params)

    const updateMealBodySchema = z.object({
      title: z.string(),
      description: z.string(),
      mealDateTime: z.date(),
      isDiet: z.boolean(),
    })

    const {
      title,
      description,
      mealDateTime,
      isDiet,
    } = updateMealBodySchema.parse(request.body);

    const updateMealUseCase = makeUpdateMealUseCase();
    const userId = request.user.sub;

    const updatedMeal = await updateMealUseCase.execute({
      userId,
      id,
      title,
      description,
      mealDateTime,
      isDiet,
    });

    if (!updatedMeal) {
      return reply.status(404).send('Meal not found.');
    }

    return reply.status(200).send(updatedMeal);
  } catch (error) {
    console.error('error updating meal', error)
    return reply.status(500).send('An error occurred while updating the meal.')
  }
}
