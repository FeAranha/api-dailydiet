import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Meal (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a meal', async () => {
    const { token, user_id} = await createAndAuthenticateUser(app)
    console.log('userId(spec) ok=>', user_id)
    const response = await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: '1# meal',
        description: 'delicius meal.',
        mealDateTime: new Date(),
        isDiet: true,
        userId: user_id
      })

    expect(response.statusCode).toEqual(201)
  })
})