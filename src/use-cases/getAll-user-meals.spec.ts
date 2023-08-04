import { InMemoryMealsRepository } from '@/repositories/in-memory/in-memory-meals-repository';
import { MealsRepository } from '@/repositories/meals-repository';
import { GetAllMealsUseCase } from './getAll-user-meals';
import { beforeEach, describe, expect, it } from 'vitest';
import { parseISO } from 'date-fns';

interface MealCreateData {
  id: string;
  title: string;
  description: string;
  mealDateTime: Date
  isDiet: boolean;
  user: { connect: { id: string } };
  userId: string
}

describe('GetAllMealsUseCase', () => {
  let getAllMealsUseCase: GetAllMealsUseCase;
  let mealsRepository: MealsRepository;

  beforeEach(() => {
    mealsRepository = new InMemoryMealsRepository();
    getAllMealsUseCase = new GetAllMealsUseCase(mealsRepository);
  });

  it('should return all meals for a specific user', async () => {
    // Criar alguns dados de refeições de exemplo
    const userId = 'user-id-1';

    const meal1: MealCreateData = {
      id: 'id-1',
      title: 'Meal 1',
      description: 'Description 1',
      mealDateTime: new Date(),
      isDiet: false,
      user: { connect: { id: userId } },
      userId: userId,
    };
    const meal2: MealCreateData = {
      id: 'id-2',
      title: 'Meal 2',
      description: 'Description 2',
      mealDateTime: new Date(),
      isDiet: true,
      user: { connect: { id: userId } },
      userId: userId,
    };

    await Promise.all([
      mealsRepository.create(meal1),
      mealsRepository.create(meal2)
    ]);

    // Executar o caso de uso para obter todas as refeições do usuário
    const result = await getAllMealsUseCase.execute(userId);

    console.log('Resultado obtido:', result.meals);

    // Verificar se o caso de uso retornou com sucesso e se todas as refeições foram obtidas
    expect(result.success).toBe(true);
    expect(result.message).toBeUndefined();
    expect(result.meals).toBeDefined();
    expect(result.meals).toHaveLength(2);
    console.log(meal1, meal2)
    expect(result.meals).toStrictEqual([meal1, meal2]);
  });

  it('should return an empty list if the user has no meals', async () => {
    // Criar um usuário sem refeições
    const userId = 'user-id-2';

    // Executar o caso de uso para obter todas as refeições do usuário
    const result = await getAllMealsUseCase.execute(userId);

    // Verificar se o caso de uso retornou com sucesso e se a lista de refeições está vazia
    expect(result.success).toBe(true);
    expect(result.message).toBeUndefined();
    expect(result.meals).toBeDefined();
    expect(result.meals).toHaveLength(0);
  });

  it('should return an error if there is an error fetching meals', async () => {
    mealsRepository.findAllByUserId = async () => {
      throw new Error('Database error');
    };
    // Executar o caso de uso para obter todas as refeições do usuário
    const result = await getAllMealsUseCase.execute('user-id-3');

    // Verificar se o caso de uso retornou com erro e se a mensagem de erro está definida
    expect(result.success).toBe(false);
    expect(result.message).toBe('Erro ao obter as refeições');
    expect(result.meals).toBeUndefined();
  });
});
