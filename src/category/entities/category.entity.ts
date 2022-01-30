import { Static, Type } from "@sinclair/typebox";

export const FeedbackCategoryEntitySchema = Type.Object({
  id: Type.Integer(),
  name: Type.String(),
});

export type FeedbackCategoryEntity = Static<
  typeof FeedbackCategoryEntitySchema
>;
