import { Prisma, Meal } from "@prisma/client";
import { MealsRepository } from "../meals-repository"
import { prisma } from "@/lib/prisma";

export class PrismaMealsRepository implements MealsRepository {
  async findAllByUserId(userId: string, page: number): Promise<Meal[]> {
    const meals = await prisma.meal.findMany({
      where: {
        userId: userId,
      },
      take: 20,
      skip: (page - 1) * 10
    })
    return meals
  }
  async findById(id: string): Promise<Meal | null> {
    const meal = await prisma.meal.findUnique({
      where: {
        id: id,
      },
    });
    return meal;
  }
  async findOneByUserIdAndMealId(userId: string, mealId: string): Promise<Meal | null> {
    const meal = await prisma.meal.findFirst({
      where: {
        id: mealId,
        userId: userId,
      },
    });
    return meal;
  }
  async create(data: Prisma.MealCreateInput): Promise<Meal> {
    const meal = await prisma.meal.create({
      data: data,
    });
    return meal;
  }
  async delete(id: string) {
    await prisma.meal.delete({
      where: {
        id: id,
      },
    });
  }

  async update(id: string, data: Prisma.MealUpdateInput): Promise<Meal> {
    const meal = await prisma.meal.update({
      where: {
        id: id,
      },
      data: data,
    });
    return meal;
  }
}