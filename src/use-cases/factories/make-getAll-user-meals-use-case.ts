import { PrismaMealsRepository } from '@/repositories/prisma/prisma-meals-repository'
import {GetAllMealsUseCase} from '../getAll-user-meals'

export function makeGetAllMealUseCase() {
  const mealsRepository = new PrismaMealsRepository()
  const useCase = new GetAllMealsUseCase(mealsRepository)

  return useCase
}