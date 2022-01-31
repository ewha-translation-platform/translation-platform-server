import { Prisma, PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";
import { feedbackInclude } from "./entities/feedback.entity";

declare module "fastify" {
  interface FastifyInstance {
    feedbackService: FeedbackService;
  }
}

class FeedbackService {
  constructor(private readonly _prisma: PrismaClient) {}

  async findAll(where: Prisma.FeedbackWhereInput) {
    const feedbacks = await this._prisma.feedback.findMany({
      where,
      ...feedbackInclude,
    });
    return feedbacks;
  }

  async findOne(where: Prisma.FeedbackWhereUniqueInput) {
    const feedback = await this._prisma.feedback.findUnique({
      where,
      ...feedbackInclude,
    });
    if (!feedback) throw new Error("Not Found");
    return feedback;
  }

  async create(data: Prisma.FeedbackCreateInput) {
    const feedback = await this._prisma.feedback.create({
      data,
      ...feedbackInclude,
    });
    if (!feedback) throw new Error("Not Found");
    return feedback;
  }

  async update(id: number, data: Prisma.FeedbackUpdateInput) {
    return await this._prisma.feedback.update({
      where: { id },
      data,
      ...feedbackInclude,
    });
  }

  async delete(id: number) {
    return await this._prisma.feedback.delete({
      where: { id },
      ...feedbackInclude,
    });
  }
}

export default fp(async (server) => {
  server.decorate("feedbackService", new FeedbackService(server.prisma));
});
