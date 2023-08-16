import { PrismaMealsRepository } from '@/repositories/prisma/prisma-meals-repository'
import {CreateMealUseCase} from '../meal-create'

export function makeCreateMealUseCase() {
  const mealsRepository = new PrismaMealsRepository()
  const useCase = new CreateMealUseCase(mealsRepository)

  return useCase
}