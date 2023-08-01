import { InMemoryMealsRepository } from '@/repositories/in-memory/in-memory-meals-repository';
import { DeleteMealUseCase } from './meal-delete';
import { MealsRepository } from '@/repositories/meals-repository';
import { beforeEach, describe, expect, it } from "vitest";

describe('DeleteMealUseCase', () => {
  let deleteMealUseCase: DeleteMealUseCase;
  let mealsRepository: MealsRepository;

  beforeEach(() => {
    // Inicializar o repositório e o caso de uso antes de cada teste
    mealsRepository = new InMemoryMealsRepository(); // Ou outra implementação que você tenha
    deleteMealUseCase = new DeleteMealUseCase(mealsRepository);
  });

  it('should delete meal when user has permission', async () => {
    // Criar uma refeição para o teste
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

    // Executar o caso de uso
    await deleteMealUseCase.execute({ mealId, userId });

    // Verificar se a refeição foi excluída corretamente
    const meal = await mealsRepository.findById(mealId);
    expect(meal).toBeNull();
  });

  it('should throw error when meal is not found', async () => {
    // Definir mealId e userId inexistentes
    const mealId = 'non-existent-meal-id';
    const userId = 'user-id';

    // Executar o caso de uso e verificar se ele lança um erro
    await expect(deleteMealUseCase.execute({ mealId, userId })).rejects.toThrowError(
      'Refeição não encontrada.'
    );
  });

  it('should throw error when user does not have permission', async () => {
    // Criar uma refeição com um userId diferente do userId do usuário
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

    // Executar o caso de uso e verificar se ele lança um erro
    await expect(deleteMealUseCase.execute({ mealId, userId })).rejects.toThrowError(
      'Você não tem permissão para excluir esta refeição.'
    );
  });
});
