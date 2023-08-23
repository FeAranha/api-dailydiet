import { MealsRepository } from "@/repositories/meals-repository";
import { UsersRepository } from "@/repositories/users-repository"
import { Meal } from "@prisma/client";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

interface GetUserMetricsUseCaseResquest {
  userId: string;
  page: number;
}

interface GetUserMetricsUseCaseResponse {
  totalMeals: number;
  diets: number;
  notDiets: number;
  bestDietSequence: number;
}

export class GetUserMetricsUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private mealsRepository: MealsRepository,
  ) { }

  private calculateMaxSequence(dietMeals: Meal[]): number {
    let currentSequenceLength = 0;
    let longestSequenceLength = 0;
  
    for (const meal of dietMeals) {
      if (meal.isDiet) {
        currentSequenceLength++;
        console.log('Current sequence=>', currentSequenceLength)
      } else {
        if (currentSequenceLength > longestSequenceLength) {
          longestSequenceLength = currentSequenceLength;
          console.log('Longest sequence:', longestSequenceLength);
        }
        currentSequenceLength = 0;
      }
    }
  
    if (currentSequenceLength > longestSequenceLength) {
      longestSequenceLength = currentSequenceLength;
      console.log('Longest sequence:', longestSequenceLength);
    }
  
    return longestSequenceLength;
  }

  async execute({ userId, page }: GetUserMetricsUseCaseResquest): Promise<GetUserMetricsUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new ResourceNotFoundError()
    }

    const meals = await this.mealsRepository.findAllByUserId(user.id, page);

    const diets: string[] = meals.filter(meal => meal.isDiet).map(meal => meal.title);
    const notDiets: string[] = meals.filter(meal => !meal.isDiet).map(meal => meal.title);

    const Meals = meals.filter(meal => meal);
    const maxSequence = this.calculateMaxSequence(Meals)
    console.log('maxSeq =>', maxSequence)
    return {
      bestDietSequence: maxSequence,
      totalMeals: meals.length,
      diets: diets.length,
      notDiets: notDiets.length
    }
  }
}