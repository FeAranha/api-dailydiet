import { Meal } from '@prisma/client'
import { MealsRepository } from '@/repositories/meals-repository'

interface CreateMealUseCaseRequest {
  title: string
  description: string
  isDiet: boolean
  userId: string
}

interface CreateMealUseCaseResponse {
  meal: Meal
}

export class CreateMealUseCase {
  constructor(private mealsRepository: MealsRepository) {}
  async execute({
    title,
    description,
    isDiet,
    userId,
  }: CreateMealUseCaseRequest): Promise<CreateMealUseCaseResponse> {
    if (!userId) {
      throw new Error('O userId do usuário é obrigatório para criar uma refeição.');
    }
    
    const meal = await this.mealsRepository.create({
      title,
      description,
      isDiet,
      user: { connect: { id: userId } }
    })
    return { meal }
  }
}