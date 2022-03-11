import { Prisma, PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";
import { submissionInclude } from "./entities/submission.entity";

declare module "fastify" {
  interface FastifyInstance {
    submissionService: SubmissionService;
  }
}

class SubmissionService {
  constructor(private readonly _prisma: PrismaClient) {}

  async findAll(where: Prisma.SubmissionWhereInput) {
    const submissions = await this._prisma.submission.findMany({
      where,
      ...submissionInclude,
    });
    return submissions;
  }

  async findOne(where: Prisma.SubmissionWhereUniqueInput) {
    const submission = await this._prisma.submission.findUnique({
      where,
      ...submissionInclude,
    });
    return submission;
  }

  async create(data: Prisma.SubmissionCreateInput) {
    const submission = await this._prisma.submission.create({
      data,
      ...submissionInclude,
    });
    if (!submission) throw new Error("Not Found");
    return submission;
  }

  async update(id: number, data: Prisma.SubmissionUpdateInput) {
    return await this._prisma.submission.update({
      where: { id },
      data,
      ...submissionInclude,
    });
  }

  async updateMany(ids: number[], data: Prisma.SubmissionUpdateInput) {
    return await this._prisma.submission.updateMany({
      data,
      where: { id: { in: ids } },
    });
  }

  async delete(id: number) {
    return await this._prisma.submission.delete({
      where: { id },
      ...submissionInclude,
    });
  }
}

export default fp(async (server) => {
  server.decorate("submissionService", new SubmissionService(server.prisma));
});
