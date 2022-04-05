import { FeedbackCategory, FeedbackCategoryType } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";

export const FeedbackCategoryEntitySchema = Type.Object({
  id: Type.Integer(),
  name: Type.String(),
  isPrimary: Type.Boolean(),
  feedbackCategoryType: Type.Enum(FeedbackCategoryType),
});

export class FeedbackCategoryEntity
  implements Static<typeof FeedbackCategoryEntitySchema>
{
  id: number;
  name: string;
  isPrimary: boolean;
  feedbackCategoryType: FeedbackCategoryType;

  constructor(feedbackCategory: FeedbackCategory) {
    this.id = feedbackCategory.id;
    this.name = feedbackCategory.name;
    this.isPrimary = feedbackCategory.isPrimary;
    this.feedbackCategoryType = feedbackCategory.feedbackCategoryType;
  }
}
