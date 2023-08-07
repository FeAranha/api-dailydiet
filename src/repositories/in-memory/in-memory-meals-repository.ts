import { Meal, Prisma } from "@prisma/client"
import { MealsRepository } from "../meals-repository"
import { randomUUID } from "node:crypto"

export class InMemoryMealsRepository implements MealsRepository {
  public items: Meal[] = []

  async findOneByUserIdAndMealId(userId: string, mealId: string): Promise<Meal | null>{
    return this.items.find(item => item.userId === userId && item.id === mealId) || null
  }
  
  async findById(id: string): Promise<Meal | null> {
    const meal = this.items.find((item) => item.id === id)

    if (!meal) {
      return null
    }
    return meal
  }

 async findAllByUserId(userId: string): Promise<Meal[]> {
    const meals = this.items.filter((item) => item.userId === userId);
    return meals;
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

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id)
  }

  async update(id: string, data: Prisma.MealUpdateInput): Promise<Meal | null> {
    const mealIndex = this.items.findIndex((item) => item.id === id)

    if (mealIndex === -1) {
      return null
    }

    const updatedMeal: Meal = Object.assign({}, this.items[mealIndex], {
      title: data.title !== undefined ? data.title : this.items[mealIndex].title,
      description:
        data.description !== undefined
          ? data.description
          : this.items[mealIndex].description,
      mealDateTime:
        data.mealDateTime !== undefined
          ? typeof data.mealDateTime === "string"
            ? new Date(data.mealDateTime)
            : data.mealDateTime
          : this.items[mealIndex].mealDateTime,
      isDiet:
        data.isDiet !== undefined ? data.isDiet : this.items[mealIndex].isDiet,
    })

    this.items[mealIndex] = updatedMeal
    return updatedMeal
  }
}