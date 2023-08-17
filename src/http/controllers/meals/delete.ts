import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import { makeDeleteMealUseCase } from '@/use-cases/factories/make-delete-meal-use-case';

export async function deleteMeal(request: FastifyRequest, reply: FastifyReply) {
  try {
    const deleteMealParamsSchema = z.object({
      mealId: z.string(),
    });

    const { mealId } = deleteMealParamsSchema.parse(request.params);
    const userId = request.user.sub;
    const deleteMealUseCase = makeDeleteMealUseCase();

    await deleteMealUseCase.execute({ mealId, userId });

    return reply.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar meal: ', error)
    return reply.status(500).send('An error ocurred while deleting the meal')
  } 
}
