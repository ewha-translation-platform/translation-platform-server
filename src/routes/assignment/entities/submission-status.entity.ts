import { Type, Static } from "@sinclair/typebox";

export const SubmissionStatusEntitySchema = Type.Object({
  studentId: Type.String(),
  submissionId: Type.Union([Type.Null(), Type.Integer()]),
  firstName: Type.String(),
  lastName: Type.String(),
  graded: Type.Boolean(),
  openedToStudent: Type.Boolean(),
  playCount: Type.Union([Type.Null(), Type.Integer()]),
  submissionDateTime: Type.Union([
    Type.Null(),
    Type.String({ format: "date-time" }),
  ]),
});
export type SubmissionStatusEntity = Static<
  typeof SubmissionStatusEntitySchema
>;
