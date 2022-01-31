import { Prisma, PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";
import { classInclude } from "./entities/class.entity";

declare module "fastify" {
  interface FastifyInstance {
    classService: ClassService;
  }
}

class ClassService {
  constructor(private readonly _prisma: PrismaClient) {}

  async findAll(where: Prisma.ClassWhereInput) {
    const classObjs = await this._prisma.class.findMany({
      where,
      ...classInclude,
    });
    return classObjs;
  }

  async findOne(where: Prisma.ClassWhereUniqueInput) {
    const classObj = await this._prisma.class.findUnique({
      where,
      ...classInclude,
    });
    if (!classObj) throw new Error("Not Found");
    return classObj;
  }

  async create(data: Prisma.ClassCreateInput) {
    const classObj = await this._prisma.class.create({
      data,
      ...classInclude,
    });
    if (!classObj) throw new Error("Not Found");
    return classObj;
  }

  async update(id: number, data: Prisma.ClassUpdateInput) {
    return await this._prisma.class.update({
      where: { id },
      data,
      ...classInclude,
    });
  }

  async delete(id: number) {
    return await this._prisma.class.delete({
      where: { id },
      ...classInclude,
    });
  }
}

export default fp(async (server) => {
  server.decorate("classService", new ClassService(server.prisma));
});
