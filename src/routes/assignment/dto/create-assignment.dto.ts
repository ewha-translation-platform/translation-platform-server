import { Static, Type } from "@sinclair/typebox";
import { AssignmentType } from "@prisma/client";

export const CreateAssignmentDtoSchema = Type.Object({
  classId: Type.Integer(),
  name: Type.String(),
  description: Type.String(),
  weekNumber: Type.Integer(),
  dueDateTime: Type.String({ format: "date-time" }),
  assignmentType: Type.Enum(AssignmentType),
  isPublic: Type.Boolean(),
  maxScore: Type.Number(),
  feedbackCategoryIds: Type.Array(Type.Integer()),
  textFile: Type.String(),
  audioFile: Type.Union([Type.Null(), Type.Any()]),
  sequentialRegions: Type.Union([Type.Null(), Type.Any()]),
  maxPlayCount: Type.Union([Type.Null(), Type.Integer()]),
  playbackRate: Type.Union([Type.Null(), Type.Number()]),
});
export type CreateAssignmentDto = Static<typeof CreateAssignmentDtoSchema>;
