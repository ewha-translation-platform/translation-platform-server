import { FeedbackCategory } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";

export const FeedbackCategoryEntitySchema = Type.Object({
  id: Type.Integer(),
  name: Type.String(),
});

export class FeedbackCategoryEntity
  implements Static<typeof FeedbackCategoryEntitySchema>
{
  id: number;
  name: string;

  constructor(feedbackCategory: FeedbackCategory) {
    this.id = feedbackCategory.id;
    this.name = feedbackCategory.name;
  }
}
