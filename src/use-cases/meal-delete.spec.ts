import { InMemoryMealsRepository } from '@/repositories/in-memory/in-memory-meals-repository';
import { DeleteMealUseCase } from './meal-delete';
import { MealsRepository } from '@/repositories/meals-repository';
import { beforeEach, describe, expect, it } from "vitest";

describe('DeleteMealUseCase', () => {
  let deleteMealUseCase: DeleteMealUseCase;
  let mealsRepository: MealsRepository;

  beforeEach(() => {
    mealsRepository = new InMemoryMealsRepository(); 
    deleteMealUseCase = new DeleteMealUseCase(mealsRepository);
  });

  it('should delete meal when user has permission', async () => {
    const userId = 'user-id';
    const mealId = 'meal-id';
    await mealsRepository.create({
      id: mealId,
      title: 'Meal 1',
      description: 'Description 1',
      mealDateTime: new Date(),
      isDiet: false,
      user: { connect: { id: userId }}
    });

    await deleteMealUseCase.execute({ mealId, userId });

    const meal = await mealsRepository.findById(mealId);
    expect(meal).toBeNull();
  });

  it('should throw error when meal is not found', async () => {
    const mealId = 'non-existent-meal-id';
    const userId = 'user-id';

    await expect(deleteMealUseCase.execute({ mealId, userId })).rejects.toThrowError(
      'Refeição não encontrada.'
    );
  });

  it('should throw error when user does not have permission', async () => {
    const userId = 'user-id';
    const mealId = 'meal-id';
    await mealsRepository.create({
      title: 'Meal 1',
      description: 'Description 1',
      mealDateTime: new Date(),
      isDiet: false,
      user: { connect: { id: 'another-user-id' } }, // Usuário diferente
      id: mealId,
    });

    await expect(deleteMealUseCase.execute({ mealId, userId })).rejects.toThrowError(
      'Você não tem permissão para excluir esta refeição.'
    );
  });
});
