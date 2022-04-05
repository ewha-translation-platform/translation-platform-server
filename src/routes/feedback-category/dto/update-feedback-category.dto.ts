import { FeedbackCategoryType } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";

export const UpdateFeedbackCategoryDtoSchema = Type.Object({
  name: Type.String(),
  feedbackCategoryType: Type.Enum(FeedbackCategoryType),
});

export type UpdateFeedbackCategoryDto = Static<
  typeof UpdateFeedbackCategoryDtoSchema
>;
