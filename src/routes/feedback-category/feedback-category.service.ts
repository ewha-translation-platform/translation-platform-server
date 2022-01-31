import { Prisma, PrismaClient } from "@prisma/client";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    feedbackCategoryService: FeedbackCategoryService;
  }
}

class FeedbackCategoryService {
  constructor(private readonly _prisma: PrismaClient) {}

  async findAll(where: Prisma.FeedbackCategoryWhereInput) {
    const feedbackCategories = await this._prisma.feedbackCategory.findMany({
      where,
    });
    return feedbackCategories;
  }

  async findOne(where: Prisma.FeedbackCategoryWhereUniqueInput) {
    const feedbackCategory = await this._prisma.feedbackCategory.findUnique({
      where,
    });
    if (!feedbackCategory) throw new Error("Not Found");
    return feedbackCategory;
  }

  async create(data: Prisma.FeedbackCategoryCreateInput) {
    const feedbackCategory = await this._prisma.feedbackCategory.create({
      data,
    });
    if (!feedbackCategory) throw new Error("Not Found");
    return feedbackCategory;
  }

  async update(id: number, data: Prisma.FeedbackCategoryUpdateInput) {
    return await this._prisma.feedbackCategory.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return await this._prisma.feedbackCategory.delete({
      where: { id },
    });
  }
}

export default fp(async (server) => {
  server.decorate(
    "feedbackCategoryService",
    new FeedbackCategoryService(server.prisma)
  );
});
