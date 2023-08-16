import { PrismaMealsRepository } from '@/repositories/prisma/prisma-meals-repository'
import {MealUpdateUseCase} from '../meal-update'

export function makeUpdateMealUseCase() {
  const mealsRepository = new PrismaMealsRepository()
  const useCase = new MealUpdateUseCase(mealsRepository)

  return useCase
}