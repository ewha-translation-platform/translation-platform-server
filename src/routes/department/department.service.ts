import { Prisma, PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";
import { departmentInclude } from "./entities/department.entity";

declare module "fastify" {
  interface FastifyInstance {
    departmentService: DepartmentService;
  }
}

class DepartmentService {
  constructor(private readonly _prisma: PrismaClient) {}

  async findAll(where: Prisma.DepartmentWhereInput) {
    const departments = await this._prisma.department.findMany({
      where,
      ...departmentInclude,
    });
    return departments;
  }

  async findOne(where: Prisma.DepartmentWhereUniqueInput) {
    const department = await this._prisma.department.findUnique({
      where,
      ...departmentInclude,
    });
    if (!department) throw new Error("Not Found");
    return department;
  }

  async create(data: Prisma.DepartmentCreateInput) {
    const department = await this._prisma.department.create({
      data,
      ...departmentInclude,
    });
    if (!department) throw new Error("Not Found");
    return department;
  }

  async update(id: number, data: Prisma.DepartmentUpdateInput) {
    return await this._prisma.department.update({
      where: { id },
      data,
      ...departmentInclude,
    });
  }

  async delete(id: number) {
    return await this._prisma.department.delete({
      where: { id },
      ...departmentInclude,
    });
  }
}

export default fp(async (server) => {
  server.decorate("departmentService", new DepartmentService(server.prisma));
});
