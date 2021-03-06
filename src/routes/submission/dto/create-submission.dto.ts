import { Static, Type } from "@sinclair/typebox";

export const CreateSubmissionDtoSchema = Type.Object({
  studentId: Type.Integer(),
  assignmentId: Type.Integer(),
  textFile: Type.String(),
  staged: Type.Boolean(),

  sequentialRegions: Type.Union([Type.Null(), Type.Any()]),
  playCount: Type.Union([Type.Null(), Type.Integer()]),
  playbackRate: Type.Union([Type.Null(), Type.Number()]),
});
export type CreateSubmissionDto = Static<typeof CreateSubmissionDtoSchema>;
