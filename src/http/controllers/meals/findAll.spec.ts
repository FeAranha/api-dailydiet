import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Find all meal (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to Find all meal', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()

    const mealsData = await prisma.meal.createMany({
      data: [
        {
          userId: user.id,
          isDiet: false,
          description: 'meal 1',
          title: '#1'
        },
        {
          userId: user.id,
          isDiet: true,
          description: 'meal 2',
          title: '#2'
        },
        {
          userId: user.id,
          isDiet: true,
          description: 'meal 3',
          title: '#3'
        },
      ],
    })

    console.log('mealData=>', mealsData)
    
    const findlAllResponse = await request(app.server)
      .get('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send()

      expect(findlAllResponse.status).toEqual(200)
  })
})