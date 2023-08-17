import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeGetAllMealUseCase } from '@/use-cases/factories/make-getAll-user-meals-use-case'

export async function findAllMeals(request: FastifyRequest, reply: FastifyReply) {
  try {
    const findAllMealsQuerySchema = z.object({
      q: z.string(),
      page: z.coerce.number().min(1).default(1),
    })

    const { q, page } = findAllMealsQuerySchema.parse(request.query)

    const findAllMealsUseCase = makeGetAllMealUseCase()

    const { meals } = await findAllMealsUseCase.execute({
      query: q,
      page, 
    })

    return reply.status(200).send({ meals })
  } catch (error){
    console.error('Error fetching meals', error)
    return reply.status(500).send('An error ocurred while fetching meals')
  }
}