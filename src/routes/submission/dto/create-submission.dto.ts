import { Static, Type } from "@sinclair/typebox";

export const CreateSubmissionDtoSchema = Type.Object({
  studentId: Type.String(),
  assignmentId: Type.Integer(),
  textFile: Type.String(),
  staged: Type.Boolean(),

  playCount: Type.Union([Type.Null(), Type.Integer()]),
  playbackRate: Type.Union([Type.Null(), Type.Number()]),
});
export type CreateSubmissionDto = Static<typeof CreateSubmissionDtoSchema>;
