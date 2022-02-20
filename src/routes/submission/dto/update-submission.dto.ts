import { Static, Type } from "@sinclair/typebox";

export const UpdateSubmissionDtoSchema = Type.Partial(
  Type.Object({
    textFile: Type.String(),
    staged: Type.Boolean(),
    generalReview: Type.Union([Type.Null(), Type.String()]),
    score: Type.Union([Type.Null(), Type.Number()]),
    feedbackIds: Type.Array(Type.Integer()),
    graded: Type.Boolean(),

    playCount: Type.Union([Type.Null(), Type.Integer()]),
    playbackRate: Type.Union([Type.Null(), Type.Number()]),
  })
);
export type UpdateSubmissionDto = Static<typeof UpdateSubmissionDtoSchema>;
