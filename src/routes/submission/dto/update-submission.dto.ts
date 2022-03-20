import { Static, Type } from "@sinclair/typebox";

export const UpdateSubmissionDtoSchema = Type.Partial(
  Type.Object({
    textFile: Type.String(),
    staged: Type.Boolean(),
    generalReview: Type.Union([Type.Null(), Type.String()]),
    feedbackIds: Type.Array(Type.Integer()),
    graded: Type.Boolean(),
    openedToStudent: Type.Boolean(),

    sequentialRegions: Type.Union([Type.Null(), Type.Any()]),
    playCount: Type.Union([Type.Null(), Type.Integer()]),
    playbackRate: Type.Union([Type.Null(), Type.Number()]),
  })
);
export type UpdateSubmissionDto = Static<typeof UpdateSubmissionDtoSchema>;

export const UpdateManySubmissionDtoSchema = Type.Object({
  ids: Type.Array(Type.Integer()),
  dto: UpdateSubmissionDtoSchema,
});
export type UpdateManySubmissionDto = Static<
  typeof UpdateManySubmissionDtoSchema
>;
