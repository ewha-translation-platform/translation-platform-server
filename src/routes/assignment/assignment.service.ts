import { Prisma, PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";
import { assignmentInclude } from "./entities/assignment.entity";

declare module "fastify" {
  interface FastifyInstance {
    assignmentService: AssignmentService;
  }
}

class AssignmentService {
  constructor(private readonly _prisma: PrismaClient) {}

  async findAll(where: Prisma.AssignmentWhereInput) {
    const assignments = await this._prisma.assignment.findMany({
      where,
      ...assignmentInclude,
    });
    return assignments;
  }

  async findOne(where: Prisma.AssignmentWhereUniqueInput) {
    const assignment = await this._prisma.assignment.findUnique({
      where,
      ...assignmentInclude,
    });
    if (!assignment) throw new Error("Not Found");
    return assignment;
  }

  async create(data: Prisma.AssignmentCreateInput) {
    const assignment = await this._prisma.assignment.create({
      data,
      ...assignmentInclude,
    });
    if (!assignment) throw new Error("Not Found");
    return assignment;
  }

  async update(id: number, data: Prisma.AssignmentUpdateInput) {
    return await this._prisma.assignment.update({
      where: { id },
      data,
      ...assignmentInclude,
    });
  }

  async delete(id: number) {
    return await this._prisma.assignment.delete({
      where: { id },
      ...assignmentInclude,
    });
  }

  async getSubmissions(id: number) {
    return await this._prisma.user.findMany({
      where: {
        attendingClass: {
          some: { class: { assignments: { some: { id } } } },
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        submissions: {
          where: { assignmentId: id, staged: false },
          include: { stagedSubmission: true },
        },
      },
    });
  }
}

export default fp(async (server) => {
  server.decorate("assignmentService", new AssignmentService(server.prisma));
});
