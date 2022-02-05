import { Static, Type } from "@sinclair/typebox";

export const CreateFeedbackCategoryDtoSchema = Type.Object({
  name: Type.String(),
  assignmentId: Type.Number(),
});

export type CreateFeedbackCategoryDto = Static<
  typeof CreateFeedbackCategoryDtoSchema
>;
