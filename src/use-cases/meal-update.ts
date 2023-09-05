import { MealsRepository } from "@/repositories/meals-repository";
import { Meal } from "@prisma/client";

interface UpdateMealUseCaseRequest {
  id: string
  title?: string
  description?: string
  mealDateTime?: Date
  isDiet?: boolean
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
      if (!data.id) {
        return { success: false, message: "ID da refeição é obrigatório." };
      }

      const meal = await this.mealRepository.findById(data.id)
      
      if (!meal || meal.userId !== data.userId){
        return { success: false, message: 'Refeição não encontrada ou não autorizado'}
      }

      const updatedMeal = await this.mealRepository.update(data.id, {
        title: data.title,
        description: data.description,
        mealDateTime: data.mealDateTime,
        isDiet: data.isDiet,
      })

      if (!updatedMeal) {
        return { success: false, message: "erro ao atualizar a refeição.", meal: undefined };
      }

      return { success: true, meal: updatedMeal }
    } catch (error) {
      console.error("Erro ao atualizar refeição:", error);
      return { success: false, message: "Erro ao atualizar refeição", meal: undefined }
    }
  }
}