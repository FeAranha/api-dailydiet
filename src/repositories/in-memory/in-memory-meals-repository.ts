import { Meal, Prisma } from "@prisma/client"
import { MealsRepository } from "../meals-repository"
import { randomUUID } from "node:crypto"

export class InMemoryMealsRepository implements MealsRepository {
  public items: Meal[] = []

  async findById(id: string) {
    const meal = this.items.find((item) => item.id === id)

    if (!meal) {
      return null
    }
    return meal
  }

  async create(data: Prisma.MealCreateInput): Promise<Meal> {
    const meal: Meal = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      mealDateTime: new Date(),
      userId: data.user.connect?.id ?? randomUUID(),
      isDiet: data.isDiet ?? false,
    }

    this.items.push(meal)
    
    return meal
  }
}