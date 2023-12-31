import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Delete Meal (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to Delete a meal', async () => {
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
  
    const deleteResponse = await request(app.server)
      .delete(`/meals/${mealData.id}`)
      .set('Authorization', `Bearer ${token}`)
      
    expect(deleteResponse.status).toEqual(204)
  })
})
