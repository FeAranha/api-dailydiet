import { FastifyInstance } from 'fastify'
import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { create } from './create'
import { updateMeal } from './update'
import { deleteMeal } from './delete'
import { findMeal } from './find'
import {findAllMeals} from './findAll'

export async function mealsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
  app.post('/meals', create);
  app.patch('/meals/:id', updateMeal);
  app.delete('/meals/:mealId', deleteMeal);
  app.get('/meals/:mealId', findMeal);
  app.get('/meals', findAllMeals);
}