import { Meal, Prisma} from '@prisma/client'

export interface MealsRepository {
  findAllByUserId(userId: string): Promise<Meal[]>
  findById(id: string): Promise<Meal | null>
  create(data: Prisma.MealCreateInput): Promise<Meal>
  delete(id: string): Promise<void>
  update(id: string, data: Prisma.MealUpdateInput): Promise<Meal | null>
}