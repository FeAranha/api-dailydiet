import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeGetUserMealUseCase } from '@/use-cases/factories/make-get-user-meal-use-case'

export async function findMeal(request: FastifyRequest, reply: FastifyReply) {
  try {
    const findMealParamsSchema = z.object({
      mealId: z.string(),
    })

    const { mealId } = findMealParamsSchema.parse(request.params);

    const getUserMealUseCase = makeGetUserMealUseCase();
    const userId = request.user.sub;

    const meal = await getUserMealUseCase.execute({ mealId, userId });

    if (!meal) {
      return reply.status(404).send('Meal not found.');
    }

    return reply.status(200).send(meal);
  } catch (error) {
    console.error('Error fetching meal:', error);
    return reply.status(500).send('An error occurred while fetching the meal.');
  }
}