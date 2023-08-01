import { MealsRepository } from '@/repositories/meals-repository'

interface DeleteMealUseCaseRequest {
  mealId: string;
  userId: string;
}

export class DeleteMealUseCase {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({ mealId, userId }: DeleteMealUseCaseRequest): Promise<void> {
    const meal = await this.mealsRepository.findById(mealId);

    if (!meal) {
      throw new Error('Refeição não encontrada.');
    }

    if (meal.userId !== userId) {
      throw new Error('Você não tem permissão para excluir esta refeição.');
    }

    await this.mealsRepository.delete(mealId);
  }
}
