import { Static, Type } from "@sinclair/typebox";

export const UpdateFeedbackCategoryDtoSchema = Type.Object({
  name: Type.String(),
});

export type UpdateFeedbackCategoryDto = Static<
  typeof UpdateFeedbackCategoryDtoSchema
>;
