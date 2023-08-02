import { Meal, Prisma} from '@prisma/client'

export interface MealsRepository {
  findById(id: string): Promise<Meal | null>
  create(data: Prisma.MealCreateInput): Promise<Meal>
  delete(id: string): Promise<void>
  update(id: string, data: Prisma.MealUpdateInput): Promise<Meal | null>
}