import { Prisma, PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    feedbackService: FeedbackService;
  }
}

class FeedbackService {
  constructor(private readonly _prisma: PrismaClient) {}

  private static _include = {
    professor: {
      include: {
        department: {
          select: { name: true, college: { select: { name: true } } },
        },
      },
    },
    categories: true,
  };

  async findAll(where: Prisma.FeedbackWhereInput) {
    const feedbacks = await this._prisma.feedback.findMany({
      where,
      include: FeedbackService._include,
    });
    return feedbacks;
  }

  async findOne(where: Prisma.FeedbackWhereUniqueInput) {
    const feedback = await this._prisma.feedback.findUnique({
      where,
      include: FeedbackService._include,
    });
    if (!feedback) throw new Error("Not Found");
    return feedback;
  }

  async create(data: Prisma.FeedbackCreateInput) {
    const feedback = await this._prisma.feedback.create({
      data,
      include: FeedbackService._include,
    });
    if (!feedback) throw new Error("Not Found");
    return feedback;
  }

  async update(id: number, data: Prisma.FeedbackUpdateInput) {
    return await this._prisma.feedback.update({
      where: { id },
      data,
      include: FeedbackService._include,
    });
  }

  async delete(id: number) {
    return await this._prisma.feedback.delete({
      where: { id },
      include: FeedbackService._include,
    });
  }
}

export default fp(async (server) => {
  server.decorate("feedbackService", new FeedbackService(server.prisma));
});
