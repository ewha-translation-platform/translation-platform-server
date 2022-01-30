import { Prisma, PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    classService: ClassService;
  }
}

class ClassService {
  constructor(private readonly _prisma: PrismaClient) {}

  private static _include = {
    course: {
      include: {
        department: {
          select: { name: true, college: { select: { name: true } } },
        },
      },
    },
  };

  async findAll(where: Prisma.ClassWhereInput) {
    const classObjs = await this._prisma.class.findMany({
      where,
      include: ClassService._include,
    });
    return classObjs;
  }

  async findOne(where: Prisma.ClassWhereUniqueInput) {
    const classObj = await this._prisma.class.findUnique({
      where,
      include: ClassService._include,
    });
    if (!classObj) throw new Error("Not Found");
    return classObj;
  }

  async create(data: Prisma.ClassCreateInput) {
    const classObj = await this._prisma.class.create({
      data,
      include: ClassService._include,
    });
    if (!classObj) throw new Error("Not Found");
    return classObj;
  }

  async update(id: number, data: Prisma.ClassUpdateInput) {
    return await this._prisma.class.update({
      where: { id },
      data,
      include: ClassService._include,
    });
  }

  async delete(id: number) {
    return await this._prisma.class.delete({
      where: { id },
      include: ClassService._include,
    });
  }
}

export default fp(async (server) => {
  server.decorate("classService", new ClassService(server.prisma));
});
