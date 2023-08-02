import { MealsRepository } from "@/repositories/meals-repository";
import { Meal } from "@prisma/client";

interface UpdateMealUseCaseRequest {
  id: string
  title: string
  description: string
  mealDateTime: Date
  isDiet: boolean
  userId: string
}

interface UpdateMealUseCaseResponse {
  success: boolean
  message?: string
  meal?: Meal
}

export class MealUpdateUseCase {
  constructor(private mealRepository: MealsRepository) {}

  async execute(data: UpdateMealUseCaseRequest): Promise<UpdateMealUseCaseResponse> {
    try {
      if (!data.id || !data.title || !data.mealDateTime) {
        return { success: false, message: "ID, título e data da refeição são obrigatórios." };
      }

      const updatedMeal = await this.mealRepository.update(data.id, {
        title: data.title,
        description: data.description,
        mealDateTime: data.mealDateTime,
        isDiet: data.isDiet,
      })

      if (updatedMeal === null) {
        return { success: false, message: "Refeição não encontrada.", meal: undefined };
      }

      return { success: true, meal: updatedMeal }
    } catch (error) {
      console.error("Erro ao atualizar refeição:", error);
      return { success: false, message: "Erro ao atualizar refeição", meal: undefined }
    }
  }
}