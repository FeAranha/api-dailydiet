import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";

let nextUserId = 1;

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(id: string) {
    const user = this.items.find(item => item.id === id)

    if (!user) {
      return null
    }

    return user
  }
  
  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email)

    if(!user) {
      return null
    }

    return user
  }
  
  async create(data: Prisma.UserCreateInput): Promise<User> {
      const user: User = {
        id: `user-id-${nextUserId}`,
        name: data.name,
        email: data.email,
        avatar: null,
        password_hash: data.password_hash,
        created_at: new Date(),
    }
    this.items.push(user)
    nextUserId++

    return user
  }
}