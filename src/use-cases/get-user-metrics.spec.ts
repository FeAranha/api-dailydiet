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

    await mealsRepository.create({
      title: 'Meal 1',
      description: 'Description 1 | in-memory' ,
      isDiet: true,
      user: { connect: { id: user.id } },
    });

     await mealsRepository.create({
      title: 'Non-Diet Meal 2',
      description: 'Non-Diet Description 2 | in-memory',
      isDiet: false,
      user: { connect: { id: user.id } },
    });

    await mealsRepository.create({
      title: 'Meal 3',
      description: 'Description | in-memory',
      isDiet: true,
      user: { connect: { id: user.id } },
    });

    await mealsRepository.create({
      title: 'Meal 4',
      description: 'Description | in-memory',
      isDiet: true,
      user: { connect: { id: user.id } },
    });

    await mealsRepository.create({
      title: 'Non-Diet Meal 5',
      description: 'Non-Diet Description | in-memory',
      isDiet: false,
      user: { connect: { id: user.id } },
    });
    
    const request = {
      userId: user.id,
      page: 1
    };

    const result = await getUserMetricsUseCase.execute(request);
    
    expect(result.totalMeals).toBe(5);
    expect(result.diets).toEqual(3);
    expect(result.notDiets).toEqual(2);
    expect(result.bestDietSequence).toEqual(2);
  });
});