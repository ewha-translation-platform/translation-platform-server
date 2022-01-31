import { Prisma, PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";
import { courseInclude } from "./entities/course.entity";

declare module "fastify" {
  interface FastifyInstance {
    courseService: CourseService;
  }
}

class CourseService {
  constructor(private readonly _prisma: PrismaClient) {}

  async findAll(where: Prisma.CourseWhereInput) {
    const courses = await this._prisma.course.findMany({
      where,
      ...courseInclude,
    });
    return courses;
  }

  async findOne(where: Prisma.CourseWhereUniqueInput) {
    const course = await this._prisma.course.findUnique({
      where,
      ...courseInclude,
    });
    if (!course) throw new Error("Not Found");
    return course;
  }

  async create(data: Prisma.CourseCreateInput) {
    const course = await this._prisma.course.create({
      data,
      ...courseInclude,
    });
    if (!course) throw new Error("Not Found");
    return course;
  }

  async update(id: number, data: Prisma.CourseUpdateInput) {
    return await this._prisma.course.update({
      where: { id },
      data,
      ...courseInclude,
    });
  }

  async delete(id: number) {
    return await this._prisma.course.delete({
      where: { id },
      ...courseInclude,
    });
  }
}

export default fp(async (server) => {
  server.decorate("courseService", new CourseService(server.prisma));
});
