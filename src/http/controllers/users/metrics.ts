import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  try {
    const getMealMetricsQuerySchema = z.object({
      page: z.coerce.number().min(1).default(1),
    })
    const { page } = getMealMetricsQuerySchema.parse(request.query)


    const getUserMetricsUseCase = makeGetUserMetricsUseCase()

    const { totalMeals,bestDietSequence, diets, notDiets } = await getUserMetricsUseCase.execute({
      userId: request.user.sub,
      page,
    })

    return reply.status(200).send({ totalMeals, bestDietSequence, diets, notDiets })
  } catch (error) {
    console.error('Error fetching user metrics', error)
    reply.status(500).send('ínternal server error')
  }
}