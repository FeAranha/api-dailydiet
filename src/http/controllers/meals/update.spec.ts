import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Update Meal (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to Update a meal', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    const mealData = await prisma.meal.create({
      data: {
        userId: user.id,
        isDiet: false,
        description: 'meal 1',
        title: '#1'
      },
    })

    const updatedMealData = {
      title: 'hamburguer diet',
      description: 'Carne magra, pão integral, 3 fatias de tomate, muita rucula, sem molho, apenas sal e pimenta do reino',
      isDiet: true,
    }

    const updateResponse = await request(app.server)
      .patch(`/meals/${mealData.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedMealData)

    expect(updateResponse.status).toEqual(200)

    const updatedMeal = await prisma.meal.findUnique({
      where: { id: mealData.id },
    });

    expect(updatedMeal?.title).toEqual(updatedMealData.title)
    expect(updatedMeal?.description).toEqual(updatedMealData.description)
  })
})
