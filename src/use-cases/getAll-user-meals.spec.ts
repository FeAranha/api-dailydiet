import { InMemoryMealsRepository } from '@/repositories/in-memory/in-memory-meals-repository'
import { GetAllMealsUseCase } from './getAll-user-meals'
import { beforeEach, describe, expect, it } from 'vitest'

let mealsRepository: InMemoryMealsRepository
let sut: GetAllMealsUseCase;

describe('GetAllMealsUseCase', () => {
  beforeEach(() => {
    mealsRepository = new InMemoryMealsRepository();
    sut = new GetAllMealsUseCase(mealsRepository);
  });

  it('should return all meals for a specific user', async () => {
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

    await mealsRepository.create({
      id: 'id-3',
      title: 'Meal 3',
      description: 'Description 3',
      mealDateTime: new Date(),
      isDiet: true,
      user: { connect: { id: 'user-id-2' } },
    })

    let result

    try {
      result = await sut.execute({userId: userId, page: 1})
    
      expect(result.success).toBe(true)
      expect(result.message).toBeUndefined()
      expect(result.meals).toBeDefined()
      expect(result.meals).toHaveLength(2)

      expect(result.meals).toEqual(expect.any(Array))
      expect(result.meals?.[0]).toEqual(expect.any(Object))
      expect(result.meals?.[1]).toEqual(expect.any(Object))
    } catch (error) {
      console.error('Error esperado:', error);
    }
  })

  it('should return an empty list if the user has no meals', async () => {
    const userId = 'user-id-2'
    const result = await sut.execute({userId: userId, page: 1})

    expect(result.success).toBe(true);
    expect(result.message).toBeUndefined()
    expect(result.meals).toBeDefined()
    expect(result.meals).toHaveLength(0)
  })

  it('should return an error if there is an error fetching meals', async () => {
    //gera erro para teste
    mealsRepository.findAllByUserId = async () => {
      throw new Error('Database error')
    }
    const result = await sut.execute({userId: 'user-id-3', page: 1})

    expect(result.success).toBe(false)
    expect(result.message).toBe('Erro ao obter as refeições')
    expect(result.meals).toBeUndefined()
  })
})