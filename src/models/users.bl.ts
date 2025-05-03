import { User } from "@prisma/client";
import prisma from "../services/prisma.service";

class UserBL implements Base<User> {
  static instance: UserBL;
  static getInstance(): UserBL {
    if (!UserBL.instance) {
      UserBL.instance = new UserBL();
    }
    return UserBL.instance;
  }

  async getById(id: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getMany(filter: Partial<User>): Promise<User[]> {
    const users = await prisma.user.findMany({
      where: filter,
    });
    return users;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data,
    });
    return user;
  }

  async delete(id: string): Promise<User> {
    const user = await prisma.user.delete({
      where: { id: Number(id) },
    });
    return user;
  }

  async create(data: Pick<User, "password_hash" | "username">): Promise<User> {
    const user = await prisma.user.create({
      data,
    });
    return user;
  }
}

export default UserBL;
