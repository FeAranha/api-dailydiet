import { Meal } from '@prisma/client'
import { MealsRepository } from '@/repositories/meals-repository'

interface CreateMealUseCaseRequest {
  title: string
  description: string
  mealDateTime: Date
  isDiet: boolean
  userId: string
}

interface CreateMealUseCaseResponse {
  meal: Meal
}

export class CreateMealUseCase {
  constructor(private mealsRepository: MealsRepository) { }
  async execute({
    title,
    description,
    mealDateTime,
    isDiet,
    userId,
  }: CreateMealUseCaseRequest): Promise<CreateMealUseCaseResponse> {
    const meal = await this.mealsRepository.create({
      title,
      description,
      mealDateTime,
      isDiet,
      userId,
    })
    return { meal }
  }
}