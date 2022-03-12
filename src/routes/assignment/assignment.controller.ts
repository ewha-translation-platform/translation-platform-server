import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { NotFound } from "http-errors";
import {
  CreateAssignmentDto,
  CreateAssignmentDtoSchema,
} from "./dto/create-assignment.dto";
import {
  UpdateAssignmentDto,
  UpdateAssignmentDtoSchema,
} from "./dto/update-assignment.dto";
import {
  AssignmentEntity,
  AssignmentEntitySchema,
} from "./entities/assignment.entity";
import {
  SubmissionStatusEntity,
  SubmissionStatusEntitySchema,
} from "./entities/submission-status.entity";

export default async function (server: FastifyInstance) {
  server.get("/", {
    schema: {
      response: { 200: Type.Array(AssignmentEntitySchema) },
    },
    async handler(): Promise<AssignmentEntity[]> {
      const data = await server.assignmentService.findAll({});
      return data.map((d) => new AssignmentEntity(d));
    },
  });

  const ParamsSchema = Type.Object({ id: Type.Number() });
  type Params = Static<typeof ParamsSchema>;
  server.get<{ Params: Params }>("/:id", {
    schema: {
      params: ParamsSchema,
      response: { 200: AssignmentEntitySchema },
    },
    async handler({ params: { id } }): Promise<AssignmentEntity> {
      const data = await server.assignmentService.findOne({ id });
      return new AssignmentEntity(data);
    },
  });

  server.post<{ Body: CreateAssignmentDto }>("/", {
    schema: {
      body: CreateAssignmentDtoSchema,
      response: { 201: AssignmentEntitySchema },
    },
    async handler({ body }, reply): Promise<AssignmentEntity> {
      const { classId, feedbackCategoryIds, ...rest } = body;
      const data = await server.assignmentService.create({
        class: { connect: { id: classId } },
        feedbackCategories: {
          connect: feedbackCategoryIds.map((id) => ({ id })),
        },
        ...rest,
      });
      reply.code(201);
      return new AssignmentEntity(data);
    },
  });

  server.get<{ Params: Params }>("/:id/audio", {
    schema: {
      params: ParamsSchema,
      headers: { 200: { "Content-Type": "audio/ogg" } },
    },
    async handler({ params: { id } }) {
      const data = await server.prisma.assignment.findUnique({
        where: { id },
        select: { audioFile: true },
      });
      if (!data?.audioFile) throw new Error("Not Found");

      return data.audioFile;
    },
  });

  server.post<{ Params: Params; Body: any }>("/:id/audio", {
    schema: { params: ParamsSchema },
    async handler({ params, body }) {
      await server.assignmentService.update(params.id, {
        audioFile: await body.audioFile.toBuffer(),
      });
      return { ok: true };
    },
  });

  server.patch<{ Params: Params; Body: UpdateAssignmentDto }>("/:id", {
    schema: { params: ParamsSchema, body: UpdateAssignmentDtoSchema },
    async handler({
      params: { id },
      body: { classId, feedbackCategoryIds, ...rest },
    }): Promise<AssignmentEntity | any> {
      try {
        const assignment = await server.assignmentService.update(
          id,
          feedbackCategoryIds
            ? {
                ...rest,
                feedbackCategories: {
                  connect: feedbackCategoryIds.map((id) => ({ id })),
                },
              }
            : rest
        );
        return new AssignmentEntity(assignment);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error);
        }

        return { ok: true };
      }
    },
  });

  server.delete<{ Params: Params }>("/:id", {
    schema: { params: ParamsSchema },
    async handler({ params: { id } }): Promise<AssignmentEntity> {
      const data = await server.assignmentService.delete(id);
      return new AssignmentEntity(data);
    },
  });

  server.get<{ Params: Params }>("/:id/submissions/my", {
    schema: { params: ParamsSchema },
    preHandler: [server.auth([server.verifyAccessToken])],
    async handler({ params: { id }, user }) {
      const submission = await server.submissionService.findOne({
        assignmentId_studentId_staged: {
          assignmentId: id,
          studentId: user.id,
          staged: false,
        },
      });
      if (!submission) throw new NotFound("Submission not found");

      return submission;
    },
  });

  server.get<{ Params: Params }>("/:id/submissions", {
    schema: {
      params: ParamsSchema,
      response: { 200: Type.Array(SubmissionStatusEntitySchema) },
    },
    async handler({ params: { id } }): Promise<SubmissionStatusEntity[]> {
      const data = await server.assignmentService.getSubmissions(id);
      console.log(data);

      return data.map((d) => {
        const submission = d.submissions.length === 0 ? null : d.submissions[0];
        const stagedSubmission = submission?.stagedSubmission || null;

        return {
          ...d,
          studentId: d.id,
          submissionId: stagedSubmission?.id || null,
          graded: stagedSubmission?.graded || false,
          openedToStudent: stagedSubmission?.openedToStudent || false,
          playCount: stagedSubmission?.playCount || null,
          submissionDateTime:
            stagedSubmission?.updatedDateTime.toISOString() || null,
        };
      });
    },
  });
}
