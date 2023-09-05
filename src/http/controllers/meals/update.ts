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
    console.log('MEALid=>', id)

    const user = request.user
    console.log('**ENDPOINT_UPDATE** USER=>', user )
    
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

    

    console.log('Received Request - Params:', request.params, 'Body:', request.body);
    
    const updatedMeal = await updateMealUseCase.execute({
      userId,
      id,
      title,
      description,
      mealDateTime,
      isDiet,
    });

    console.log('Updated Meal=>', updatedMeal)

    if (!updatedMeal.success) {
      return reply.status(404).send(updatedMeal.message);
    }

    return reply.status(200).send(updatedMeal.meal);
  } catch (error) {
    console.error('error updating meal', error)
    return reply.status(500).send('An error occurred while updating the meal.')
  }
}