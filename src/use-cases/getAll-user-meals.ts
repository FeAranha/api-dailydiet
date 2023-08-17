import { MealsRepository } from "@/repositories/meals-repository";
import { Meal } from "@prisma/client";

interface GetAllMealsUseCaseRequest {
  query: string
  page: number
}

interface GetAllMealsUseCaseResponse {
  success: boolean
  message?: string
  meals?: Meal[]
}

export class GetAllMealsUseCase {
  constructor(private mealsRepository: MealsRepository) {}

  async execute({query, page}: GetAllMealsUseCaseRequest): Promise<GetAllMealsUseCaseResponse> {
    try {
      //TODO verificar se o usuário está autenticado
      const meals = await this.mealsRepository.findAllByUserId(query, page)

      return { success: true, meals }   
    } catch (error) {
      console.error("Erro ao obter as refeições:", error);
      return { success: false, message: "Erro ao obter as refeições" };
    }
  }
}