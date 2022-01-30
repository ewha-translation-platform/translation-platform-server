import { Prisma, PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    userService: UserService;
  }
}

class UserService {
  constructor(private readonly _prisma: PrismaClient) {}

  private static _include = {
    department: {
      select: { name: true, college: { select: { name: true } } },
    },
  };

  async findAll(where: Prisma.UserWhereInput) {
    const users = await this._prisma.user.findMany({
      where,
      include: UserService._include,
    });
    return users;
  }

  async findOne(where: Prisma.UserWhereUniqueInput) {
    const user = await this._prisma.user.findUnique({
      where,
      include: UserService._include,
    });
    if (!user) throw new Error("Not Found");
    return user;
  }

  async create(data: Prisma.UserCreateInput) {
    console.log(data);
    const user = await this._prisma.user.findUnique({
      where: { id: 1 },
      include: UserService._include,
    });
    if (!user) throw new Error("Not Found");
    return user;
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
    return await this._prisma.user.update({
      where: { id },
      data,
      include: UserService._include,
    });
  }

  async delete(id: number) {
    return await this._prisma.user.delete({
      where: { id },
      include: UserService._include,
    });
  }
}

export default fp(async (server) => {
  server.decorate("userService", new UserService(server.prisma));
});
