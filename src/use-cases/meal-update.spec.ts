import { InMemoryMealsRepository } from '@/repositories/in-memory/in-memory-meals-repository';
import { MealUpdateUseCase } from './meal-update';
import { MealsRepository } from '@/repositories/meals-repository';
import { beforeEach, describe, expect, it } from "vitest";

describe('MealUpdateUseCase', () => {
  let updateMealUseCase: MealUpdateUseCase;
  let mealsRepository: MealsRepository;

  beforeEach(() => {
    mealsRepository = new InMemoryMealsRepository();
    updateMealUseCase = new MealUpdateUseCase(mealsRepository);
  });

  it('should update meal when data is valid', async () => {
    const userId = 'user-id';
    const mealId = 'meal-id';
    
    await mealsRepository.create({
      id: mealId,
      title: 'Meal 1',
      description: 'Description 1',
      mealDateTime: new Date(),
      isDiet: false,
      user: { connect: { id: userId } }
    });

    const updatedMealData = {
      id: mealId,
      title: 'hamburguer',
      description: 'Updated Description',
      mealDateTime: new Date(),
      isDiet: true,
      userId,
    };
    const result = await updateMealUseCase.execute(updatedMealData);

    expect(result.success).toBe(true)
    expect(result.message).toBeUndefined()
    expect(result.meal).toBeDefined()
    expect(result.meal?.title).toEqual('hamburguer')

    const updatedMeal = await mealsRepository.findById(mealId);
    expect(updatedMeal).toEqual(result.meal);
  });

  it('should return error when meal is not found', async () => {
    const mealId = 'non-existent-meal-id';
    const userId = 'user-id';

    const updatedMealData = {
      id: mealId,
      title: 'Updated Meal',
      description: 'Updated Description',
      mealDateTime: new Date(),
      isDiet: true,
      userId,
    };
    const result = await updateMealUseCase.execute(updatedMealData);
    
    expect(result.success).toBe(false);
    expect(result.message).toBe('Refeição não encontrada ou não autorizado');
    expect(result.meal).toBeUndefined(); // Nenhuma refeição deve estar presente
  });

  it('should return error when data is invalid', async () => {
    const mealId = 'meal-id';
    const userId = 'user-id';

    const invalidMealData = {
      id: mealId,
      title: 'Invalid Meal',
      description: 'Updated Description',
      mealDateTime: new Date(),
      isDiet: true,
      userId,
    };
    const result = await updateMealUseCase.execute(invalidMealData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Refeição não encontrada ou não autorizado');
    expect(result.meal).toBeUndefined();
  });
});
