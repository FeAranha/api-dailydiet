import { expect, describe, it, beforeEach } from 'vitest';
import { GetUserMealUseCase } from './get-user-meal';
import { InMemoryMealsRepository } from '@/repositories/in-memory/in-memory-meals-repository';

let mealsRepository: InMemoryMealsRepository
let sut: GetUserMealUseCase

describe('GetUserMealUseCase', () => {
  beforeEach(async () => {
    mealsRepository = new InMemoryMealsRepository()
    sut = new GetUserMealUseCase(mealsRepository)
  })

  it('should return a meal for a specific user', async () => {
    const userId = 'user-id-1';

    await mealsRepository.create({
      id: 'id-1',
      title: 'Meal 1',
      description: 'Description 1',
      mealDateTime: new Date(),
      isDiet: false,
      user: { connect: { id: userId } },
    })

    await mealsRepository.create({
      id: 'id-2',
      title: 'Meal 2',
      description: 'Description 2',
      mealDateTime: new Date(),
      isDiet: true,
      user: { connect: { id: userId } },
    })

    const request = {
      userId: 'user-id-1',
      mealId: 'id-2',
    };

    const result = await sut.execute(request);
    
    console.log('resultado obtido', result)
    expect(result.success).toBe(true);
    expect(result.meal).toBeDefined();
    expect(result.meal).toBeDefined();
    expect(Object.keys(result.meal as Record<string, unknown>).length).toBeGreaterThan(0);
  });

  it('should return a failure message for a non-existent meal', async () => {
    mealsRepository.findOneByUserIdAndMealId = async () => null;
    
    const request = {
      userId: 'user-id',
      mealId: 'non-existent-meal-id',
    };

    const result= await sut.execute(request);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Meal not found');
  });

  it('should return a failure message when encountering an error', async () => {
    mealsRepository.findOneByUserIdAndMealId = async () => {
      throw new Error();
    }

    const request = {
      userId: 'user-id',
      mealId: 'meal-id',
    };

    const response = await sut.execute(request);

    expect(response.success).toBe(false);
    expect(response.message).toBe('erro ao obter a refeiçãoo');
  });
});
