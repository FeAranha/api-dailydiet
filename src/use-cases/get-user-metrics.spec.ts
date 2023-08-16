import { beforeEach, describe, expect, it } from "vitest";
import { GetUserMetricsUseCase } from "./get-user-metrics";
import { User } from '@prisma/client';
import { InMemoryMealsRepository } from '@/repositories/in-memory/in-memory-meals-repository';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';

describe('GetUserMetricsUseCase', () => {
  let usersRepository: InMemoryUsersRepository;
  let mealsRepository: InMemoryMealsRepository;
  let getUserMetricsUseCase: GetUserMetricsUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    mealsRepository = new InMemoryMealsRepository();
    getUserMetricsUseCase = new GetUserMetricsUseCase(usersRepository, mealsRepository);
  });

  it('should return user metrics including best diet sequence', async () => {
    const user: User = {
      id: 'user-id-1',
      name: 'User 1',
      email: 'user1@example.com',
      password_hash: 'hashed_password',
      avatar: null,
      created_at: new Date(),
      
    };
    await usersRepository.create(user);

    const meal1 = await mealsRepository.create({
      id: 'meal-id-1',
      title: 'Meal 1',
      description: 'Description 1 | in-memory' ,
      mealDateTime: new Date(),
      isDiet: true,
      user: { connect: { id: user.id } },
    });

    const meal2 = await mealsRepository.create({
      id: 'meal-id-2',
      title: 'Meal 2',
      description: 'Description 2 | in-memory',
      mealDateTime: new Date(),
      isDiet: true,
      user: { connect: { id: user.id } },
    });

    const meal3 = await mealsRepository.create({
      id: 'meal-id-3',
      title: 'Non-Diet Meal',
      description: 'Non-Diet Description | in-memory',
      mealDateTime: new Date(),
      isDiet: false,
      user: { connect: { id: user.id } },
    });

    const allMeals = mealsRepository.findAllByUserId(user.id)
    console.log('meals:', allMeals)

    console.log('userId => ', user.id)
    console.log('email', user.email)
    
    const findUserById = usersRepository.findById(user.id)
    console.log('findById => ', findUserById)

    const findUserByEmail = usersRepository.findByEmail(user.email)
    console.log('findByEmail => ', findUserByEmail)

    const request = {
      userId: user.id,
    };

    const result = await getUserMetricsUseCase.execute(request);
    console.log('Resultado obtido:', result);
    
    expect(result.totalMeals).toBe(3);
    expect(result.diets).toEqual(['Meal 1', 'Meal 2']);
    expect(result.notDiets).toEqual(['Non-Diet Meal']);
    expect(result.bestDietSequence).toEqual([meal1, meal2]);
  });
});