import { Prisma, PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    courseService: CourseService;
  }
}

class CourseService {
  constructor(private readonly _prisma: PrismaClient) {}

  private static _include = {
    department: {
      select: { name: true, college: { select: { name: true } } },
    },
  };

  async findAll(where: Prisma.CourseWhereInput) {
    const courses = await this._prisma.course.findMany({
      where,
      include: CourseService._include,
    });
    return courses;
  }

  async findOne(where: Prisma.CourseWhereUniqueInput) {
    const course = await this._prisma.course.findUnique({
      where,
      include: CourseService._include,
    });
    if (!course) throw new Error("Not Found");
    return course;
  }

  async create(data: Prisma.CourseCreateInput) {
    const course = await this._prisma.course.create({
      data,
      include: CourseService._include,
    });
    if (!course) throw new Error("Not Found");
    return course;
  }

  async update(id: number, data: Prisma.CourseUpdateInput) {
    return await this._prisma.course.update({
      where: { id },
      data,
      include: CourseService._include,
    });
  }

  async delete(id: number) {
    return await this._prisma.course.delete({
      where: { id },
      include: CourseService._include,
    });
  }
}

export default fp(async (server) => {
  server.decorate("courseService", new CourseService(server.prisma));
});
