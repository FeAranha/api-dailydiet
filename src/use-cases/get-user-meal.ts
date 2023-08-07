import { MealsRepository } from "@/repositories/meals-repository";
import { Meal } from "@prisma/client";

interface GetUserMealRequest {
  userId: string;
  mealId: string;
}

interface GetUserMealResponse {
  success: boolean;
  message?: string;
  meal?: Meal;
}

export class GetUserMealUseCase {
  constructor(private mealsRepository: MealsRepository) { }

  async execute(request: GetUserMealRequest): Promise<GetUserMealResponse> {
    try {
      const { userId, mealId } = request

      const meal = await this.mealsRepository.findOneByUserIdAndMealId(userId, mealId)

      if (meal) {
        return {
          success: true,
          meal
        }
      } else {
        return {
          success: false,
          message: 'Meal not found'
        }
      }
    } catch (error){
      return {
        success: false,
        message: "erro ao obter a refeiçãoo"
      }
    }
  }
}

