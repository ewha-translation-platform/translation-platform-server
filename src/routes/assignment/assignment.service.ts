import { Prisma, PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    assignmentService: AssignmentService;
  }
}

class AssignmentService {
  constructor(private readonly _prisma: PrismaClient) {}

  private static _include = { feedbackCategories: true };

  async findAll(where: Prisma.AssignmentWhereInput) {
    const assignments = await this._prisma.assignment.findMany({
      where,
      include: AssignmentService._include,
    });
    return assignments;
  }

  async findOne(where: Prisma.AssignmentWhereUniqueInput) {
    const assignment = await this._prisma.assignment.findUnique({
      where,
      include: AssignmentService._include,
    });
    if (!assignment) throw new Error("Not Found");
    return assignment;
  }

  async create(data: Prisma.AssignmentCreateInput) {
    const assignment = await this._prisma.assignment.create({
      data,
      include: AssignmentService._include,
    });
    if (!assignment) throw new Error("Not Found");
    return assignment;
  }

  async update(id: number, data: Prisma.AssignmentUpdateInput) {
    return await this._prisma.assignment.update({
      where: { id },
      data,
      include: AssignmentService._include,
    });
  }

  async delete(id: number) {
    return await this._prisma.assignment.delete({
      where: { id },
      include: AssignmentService._include,
    });
  }
}

export default fp(async (server) => {
  server.decorate("assignmentService", new AssignmentService(server.prisma));
});
