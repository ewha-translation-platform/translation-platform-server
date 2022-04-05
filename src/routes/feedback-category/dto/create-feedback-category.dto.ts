import { FeedbackCategoryType } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";

export const CreateFeedbackCategoryDtoSchema = Type.Object({
  name: Type.String(),
  assignmentId: Type.Number(),
  feedbackCategoryType: Type.Enum(FeedbackCategoryType),
});

export type CreateFeedbackCategoryDto = Static<
  typeof CreateFeedbackCategoryDtoSchema
>;
