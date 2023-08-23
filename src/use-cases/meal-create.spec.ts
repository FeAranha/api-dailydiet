import { InMemoryMealsRepository } from "@/repositories/in-memory/in-memory-meals-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateMealUseCase } from "./meal-create";

let mealsRepository: InMemoryMealsRepository
let sut: CreateMealUseCase

describe('Create Meal Use Case', () => {
  beforeEach(() => {
    mealsRepository = new InMemoryMealsRepository()
    sut = new CreateMealUseCase(mealsRepository)
  })

  it('should to create meal', async () => {
    const { meal } = await sut.execute({
      title: 'Meal 1',
      description: 'Description 1',
      //mealDateTime: new Date(),
      isDiet: false,
      userId: 'user-id'
    })
    expect(meal.id).toEqual(expect.any(String))
  })
})