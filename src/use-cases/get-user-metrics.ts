import { MealsRepository } from "@/repositories/meals-repository";
import { UsersRepository } from "@/repositories/users-repository"
import { Meal } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetUserMetricsUseCaseResquest {
  userId: string;
}

interface GetUserMetricsUseCaseResponse {
  totalMeals: number;
  diets: string[];
  notDiets: string[];
  bestDietSequence: Meal[];
}

export class GetUserMetricsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private mealsRepository: MealsRepository,
  ) { }

  private calculateMaxSequence(dietMeals: Meal[]): Meal[] {
    const sortedMeals = [...dietMeals].sort((mealA, mealB) =>
      mealA.mealDateTime.getTime() - mealB.mealDateTime.getTime()
    );
  
    let currentSequence: Meal[] = [];
    let longestSequence: Meal[] = [];
  
    for (const meal of sortedMeals) {
      if (
        currentSequence.length === 0 ||
        meal.mealDateTime.getTime() ===
          currentSequence[currentSequence.length - 1].mealDateTime.getTime() + 86400000 // Um dia em milissegundos
      ) {
        currentSequence = [meal];
      } else {
        currentSequence.push(meal);
      }
  
      if (currentSequence.length > longestSequence.length) {
        longestSequence = [...currentSequence];
      }
    }

    return longestSequence;
  }

  async execute({ userId }: GetUserMetricsUseCaseResquest): Promise<GetUserMetricsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const meals = await this.mealsRepository.findAllByUserId(user.id);

    const diets: string[] = meals.filter(meal => meal.isDiet).map(meal => meal.title);
    const notDiets: string[] = meals.filter(meal => !meal.isDiet).map(meal => meal.title);

    const dietMeals = meals.filter(meal => meal.isDiet);
    const maxSequence: Meal[] = this.calculateMaxSequence(dietMeals)
    
    return {
      bestDietSequence: maxSequence,
      totalMeals: meals.length,
      diets: diets,
      notDiets: notDiets,
    }
  }
}