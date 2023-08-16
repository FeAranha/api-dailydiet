import {GetUserMealUseCase} from '../get-user-meal'
import {PrismaMealsRepository} from '@/repositories/prisma/prisma-meals-repository'

export function makeGetUserMealUseCase() {
  const mealsRepository = new PrismaMealsRepository()
  const useCase = new GetUserMealUseCase(mealsRepository)

  return useCase
}