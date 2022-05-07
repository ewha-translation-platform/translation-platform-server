import { createFFmpeg } from "@ffmpeg/ffmpeg";
import { Prisma } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";
import axios from "axios";
import { FastifyInstance } from "fastify";
import FormData from "form-data";
import { BadRequest, InternalServerError, NotFound } from "http-errors";
import {
  CreateSubmissionDto,
  CreateSubmissionDtoSchema,
} from "./dto/create-submission.dto";
import {
  UpdateManySubmissionDto,
  UpdateManySubmissionDtoSchema,
  UpdateSubmissionDto,
  UpdateSubmissionDtoSchema,
} from "./dto/update-submission.dto";
import {
  SubmissionEntity,
  SubmissionEntitySchema,
  submissionInclude,
} from "./entities/submission.entity";

interface Region {
  [prop: string]: Prisma.JsonValue;
  start: number;
  end: number;
}

interface Annotation {
  start: number;
  end: number;
  type: "FILLER" | "BACKTRACK" | "PAUSE" | "DELAY";
  duration?: number;
}

interface ResponseData {
  annotations: Annotation[];
  textFile: string;
  timestamps: Region[];
}

export default async function (server: FastifyInstance) {
  server.get("/", {
    schema: {
      response: { 200: Type.Array(SubmissionEntitySchema) },
    },
    async handler(): Promise<SubmissionEntity[]> {
      const data = await server.submissionService.findAll({});
      return data.map((d) => new SubmissionEntity(d));
    },
  });

  const ParamsSchema = Type.Object({ id: Type.Number() });
  type Params = Static<typeof ParamsSchema>;
  server.get<{ Params: Params }>("/:id", {
    schema: {
      params: ParamsSchema,
      response: { 200: SubmissionEntitySchema },
    },
    async handler({ params: { id } }): Promise<SubmissionEntity> {
      const data = await server.submissionService.findOne({ id });
      if (!data) throw new NotFound("Submission not found");
      return new SubmissionEntity(data);
    },
  });

  server.post<{ Body: CreateSubmissionDto }>("/", {
    schema: {
      body: CreateSubmissionDtoSchema,
      response: { 201: SubmissionEntitySchema },
    },
    async handler({ body }, reply): Promise<SubmissionEntity> {
      const { studentId, assignmentId, ...rest } = body;
      const data = await server.submissionService.create({
        ...rest,
        student: { connect: { id: studentId } },
        assignment: { connect: { id: assignmentId } },
      });
      reply.code(201);
      return new SubmissionEntity(data);
    },
  });

  server.get<{ Params: Params }>("/:id/audio", {
    schema: {
      params: ParamsSchema,
      headers: { 200: { "Content-Type": "audio/webm" } },
    },
    async handler({ params: { id } }) {
      const data = await server.prisma.submission.findUnique({
        where: { id },
        select: { audioFile: true },
      });
      if (!data?.audioFile) throw new NotFound("Audiofile doesn't exist");

      return data.audioFile;
    },
  });

  server.post<{ Params: Params; Body: any }>("/:id/audio", {
    schema: { params: ParamsSchema },
    async handler({ params, body }) {
      const ffmpeg = createFFmpeg({ log: true });
      await ffmpeg.load();
      ffmpeg.FS("writeFile", "input.mp3", await body.audioFile.toBuffer());
      await ffmpeg.run("-i", "input.mp3", "output.mp3");
      const audioFile = Buffer.from(ffmpeg.FS("readFile", "output.mp3"));

      await server.submissionService.update(params.id, { audioFile });
      return { ok: true };
    },
  });

  server.post<{ Params: Params }>("/:id/stage", {
    schema: { params: ParamsSchema },
    preHandler: server.auth([server.verifyAccessToken]),
    async handler({ params: { id } }, _reply) {
      const draft = await server.submissionService.findOne({ id });
      if (!draft) throw new NotFound("Submission not found");

      let {
        assignmentId,
        studentId,
        textFile,
        audioFile,
        sequentialRegions,
        playCount,
        playbackRate,
      } = draft;

      const stagedSubmission = await server.prisma.submission.upsert({
        where: {
          assignmentId_studentId_staged: {
            assignmentId,
            studentId,
            staged: true,
          },
        },
        create: {
          assignment: { connect: { id: assignmentId } },
          student: { connect: { id: studentId } },
          draftSubmission: { connect: { id: draft.id } },
          staged: true,
          textFile,
          audioFile,
          sequentialRegions: sequentialRegions ?? Prisma.JsonNull,
          playCount,
          playbackRate,
        },
        update: {
          textFile,
          audioFile,
          sequentialRegions: sequentialRegions ?? Prisma.JsonNull,
          playCount,
          playbackRate,
        },
        ...submissionInclude,
      });

      await server.prisma.feedback.deleteMany({
        where: { submissionId: stagedSubmission.id },
      });

      return stagedSubmission;
    },
  });

  server.post<{ Params: Params }>("/:id/stt", {
    schema: { params: ParamsSchema, response: { 200: SubmissionEntitySchema } },
    preHandler: server.auth([server.verifyAccessToken, server.verifyProfessor]),
    async handler({ params: { id }, user }, _reply): Promise<SubmissionEntity> {
      const submission = await server.submissionService.findOne({ id });
      if (!submission || !submission.staged || !submission.audioFile)
        throw new BadRequest("bad request");

      const {
        audioFile,
        assignment: { assignmentType },
        sequentialRegions,
      } = submission;

      const formData = new FormData();
      formData.append("file", audioFile);
      if (assignmentType === "SEQUENTIAL")
        formData.append("sequentialRegions", JSON.stringify(sequentialRegions));

      try {
        const {
          data: { textFile, timestamps, annotations },
        } = await axios.post<ResponseData>(
          `http://127.0.0.1:${
            server.config.STT_SERVER_PORT
          }/${assignmentType.toLowerCase()}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        await server.prisma.feedback.deleteMany({
          where: { submissionId: id },
        });

        for await (const an of annotations) {
          await server.prisma.feedback.create({
            data: {
              selectedIdx: { start: an.start, end: an.end },
              categories: {
                connect: {
                  name:
                    an.type === "FILLER"
                      ? "필러"
                      : an.type === "BACKTRACK"
                      ? "백트래킹"
                      : "지연",
                },
              },
              professorId: user.id,
              selectedSourceText: false,
              submissionId: id,
            },
          });
        }

        return new SubmissionEntity(
          await server.submissionService.update(id, {
            textFile,
            timestamps,
          })
        );
      } catch (e) {
        console.error(e);
        throw new InternalServerError("STT server not working");
      }
    },
  });

  server.patch<{ Params: Params; Body: UpdateSubmissionDto }>("/:id", {
    schema: { params: ParamsSchema, body: UpdateSubmissionDtoSchema },
    async handler({
      params: { id },
      body: { sequentialRegions, ...rest },
    }): Promise<SubmissionEntity> {
      const data = await server.submissionService.update(id, {
        sequentialRegions: sequentialRegions ?? Prisma.JsonNull,
        ...rest,
      });
      return new SubmissionEntity(data);
    },
  });

  server.patch<{ Body: UpdateManySubmissionDto }>("/batch", {
    schema: { body: UpdateManySubmissionDtoSchema },
    async handler({ body: { ids, dto } }): Promise<{ count: number }> {
      return await server.submissionService.updateMany(ids, dto);
    },
  });

  server.delete<{ Params: Params }>("/:id", {
    schema: { params: ParamsSchema },
    async handler({ params: { id } }): Promise<SubmissionEntity> {
      const data = await server.submissionService.delete(id);
      return new SubmissionEntity(data);
    },
  });
}
