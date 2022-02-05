import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import {
  CreateFeedbackDto,
  CreateFeedbackDtoSchema,
} from "./dto/create-feedback.dto";
import {
  UpdateFeedbackDto,
  UpdateFeedbackDtoSchema,
} from "./dto/update-feedback.dto";
import {
  FeedbackEntity,
  FeedbackEntitySchema,
} from "./entities/feedback.entity";

export default async function (server: FastifyInstance) {
  server.get("/", {
    schema: {
      response: { 200: Type.Array(FeedbackEntitySchema) },
    },
    async handler(): Promise<FeedbackEntity[]> {
      const data = await server.feedbackService.findAll({});
      return data.map((d) => new FeedbackEntity(d));
    },
  });

  const ParamsSchema = Type.Object({ id: Type.Number() });
  type Params = Static<typeof ParamsSchema>;
  server.get<{ Params: Params }>("/:id", {
    schema: {
      params: ParamsSchema,
      response: { 200: FeedbackEntitySchema },
    },
    async handler({ params: { id } }): Promise<FeedbackEntity> {
      const data = await server.feedbackService.findOne({ id });
      return new FeedbackEntity(data);
    },
  });

  server.post<{ Body: CreateFeedbackDto }>("/", {
    schema: {
      body: CreateFeedbackDtoSchema,
      response: { 201: FeedbackEntitySchema },
    },
    async handler({ body }, reply): Promise<FeedbackEntity> {
      const { submissionId, professorId, categoryIds, ...rest } = body;
      const data = await server.feedbackService.create({
        ...rest,
        submission: { connect: { id: submissionId } },
        professor: { connect: { id: professorId } },
        categories: { connect: categoryIds.map((id) => ({ id })) },
      });
      reply.code(201);
      return new FeedbackEntity(data);
    },
  });

  server.patch<{ Params: Params; Body: UpdateFeedbackDto }>("/:id", {
    schema: { params: ParamsSchema, body: UpdateFeedbackDtoSchema },
    async handler({
      params: { id },
      body: { categoryIds, ...rest },
    }): Promise<FeedbackEntity> {
      const data = await server.feedbackService.update(id, {
        ...rest,
        categories: { connect: categoryIds?.map((id) => ({ id })) || [] },
      });
      return new FeedbackEntity(data);
    },
  });

  server.delete<{ Params: Params }>("/:id", {
    schema: { params: ParamsSchema },
    async handler({ params: { id } }): Promise<FeedbackEntity> {
      const data = await server.feedbackService.delete(id);
      return new FeedbackEntity(data);
    },
  });
}
