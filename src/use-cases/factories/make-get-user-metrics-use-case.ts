import { PrismaMealsRepository } from '@/repositories/prisma/prisma-meals-repository'
import {PrismaUsersRepository} from '@/repositories/prisma/prisma-users-repository'
import {GetUserMetricsUseCase} from '../get-user-metrics'

export function makeGetUserMetricsUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const mealsRepository = new PrismaMealsRepository()
  
  const useCase = new GetUserMetricsUseCase( usersRepository, mealsRepository)

  return useCase
}