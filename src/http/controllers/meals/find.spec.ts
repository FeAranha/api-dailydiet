import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Find Meal (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  
  it('should be able to Find a meal', async () => {
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

    const findResponse = await request(app.server)
      .get(`/meals/${mealData.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(findResponse.status).toEqual(200)
  })
})