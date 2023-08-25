import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Meals Metrics (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get the metrics of meals', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    const mealsData = await prisma.meal.createMany({
      data: [
        {
          userId: user.id,
          isDiet: true,
          description: 'meal 1',
          title: '#1'
        },
        {
          userId: user.id,
          isDiet: false,
          description: 'meal 2',
          title: '#2'
        },
        {
          userId: user.id,
          isDiet: true,
          description: 'meal 3',
          title: '#3'
        },
        {
          userId: user.id,
          isDiet: true,
          description: 'meal 4',
          title: '#4'
        },
        {
          userId: user.id,
          isDiet: false,
          description: 'meal 5',
          title: '#5'
        },
      ],
    })

    console.log('metricsData =>', mealsData)

    const response = await request(app.server)
      .get('/metrics')
      .set('Authorization', `Bearer ${token}`)
      .send()
    expect(response.statusCode).toEqual(200)
    expect(response.body.totalMeals).toEqual(5)
    expect(response.body.diets).toEqual(3)
    expect(response.body.notDiets).toEqual(2)
    expect(response.body.bestDietSequence).toEqual(2)
  })
})