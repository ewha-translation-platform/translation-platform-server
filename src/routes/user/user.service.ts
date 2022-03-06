import { Prisma, PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";
import { userInclude } from "./entities/user.entity";

declare module "fastify" {
  interface FastifyInstance {
    userService: UserService;
  }
}

class UserService {
  constructor(private readonly _prisma: PrismaClient) {}

  async findAll(where: Prisma.UserWhereInput) {
    const users = await this._prisma.user.findMany({
      where,
      ...userInclude,
    });
    return users;
  }

  async findOne(where: Prisma.UserWhereUniqueInput) {
    const user = await this._prisma.user.findUnique({
      where,
      ...userInclude,
    });
    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await this._prisma.user.create({
      data,
      ...userInclude,
    });
    return user;
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await this._prisma.user.update({
      where: { id },
      data,
      ...userInclude,
    });
  }

  async delete(id: string) {
    return await this._prisma.user.delete({
      where: { id },
      ...userInclude,
    });
  }
}

export default fp(async (server) => {
  server.decorate("userService", new UserService(server.prisma));
});
