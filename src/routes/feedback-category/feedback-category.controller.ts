import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import {
  CreateFeedbackCategoryDto,
  CreateFeedbackCategoryDtoSchema,
} from "./dto/create-feedback-category.dto";
import {
  UpdateFeedbackCategoryDto,
  UpdateFeedbackCategoryDtoSchema,
} from "./dto/update-feedback-category.dto";
import {
  FeedbackCategoryEntity,
  FeedbackCategoryEntitySchema,
} from "./entities/feedback-category.entity";
import feedbackCategoryService from "./feedback-category.service";

export default async function (server: FastifyInstance) {
  await server.register(feedbackCategoryService);

  server.get("/", {
    schema: {
      response: { 200: Type.Array(FeedbackCategoryEntitySchema) },
    },
    async handler(): Promise<FeedbackCategoryEntity[]> {
      const data = await server.feedbackCategoryService.findAll({});
      return data.map((d) => new FeedbackCategoryEntity(d));
    },
  });

  const ParamsSchema = Type.Object({ id: Type.Number() });
  type Params = Static<typeof ParamsSchema>;
  server.get<{ Params: Params }>("/:id", {
    schema: {
      params: ParamsSchema,
      response: { 200: FeedbackCategoryEntitySchema },
    },
    async handler({ params: { id } }): Promise<FeedbackCategoryEntity> {
      const data = await server.feedbackCategoryService.findOne({ id });
      return new FeedbackCategoryEntity(data);
    },
  });

  server.post<{ Body: CreateFeedbackCategoryDto }>("/", {
    schema: {
      body: CreateFeedbackCategoryDtoSchema,
      response: { 201: FeedbackCategoryEntitySchema },
    },
    async handler({ body }, reply): Promise<FeedbackCategoryEntity> {
      const { name } = body;
      const data = await server.feedbackCategoryService.create({ name });
      reply.code(201);
      return new FeedbackCategoryEntity(data);
    },
  });

  server.patch<{ Params: Params; Body: UpdateFeedbackCategoryDto }>("/:id", {
    schema: { params: ParamsSchema, body: UpdateFeedbackCategoryDtoSchema },
    async handler({ params: { id }, body }): Promise<FeedbackCategoryEntity> {
      const data = await server.feedbackCategoryService.update(id, body);
      return new FeedbackCategoryEntity(data);
    },
  });

  server.delete<{ Params: Params }>("/:id", {
    schema: { params: ParamsSchema },
    async handler({ params: { id } }): Promise<FeedbackCategoryEntity> {
      const data = await server.feedbackCategoryService.delete(id);
      return new FeedbackCategoryEntity(data);
    },
  });
}
