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
    const { token, user_id } = await createAndAuthenticateUser(app)
    console.log('logged in userId => ', user_id)

    const mealData = {
      title: '1# meal',
      description: 'delicius meal.',
      mealDateTime: new Date(),
      isDiet: true,
    }
    console.log('meal data =>', mealData)

    const response = await request(app.server)
      .post('/meals')
      .set('Authorization', `Bearer ${token}`)
      .send(mealData)

    console.log('Response status:', response.statusCode);
    console.log('Response body:', response.body);

    expect(response.statusCode).toEqual(201)
  })
})