import {
  FeedbackCategoryEntity,
  FeedbackCategoryEntitySchema,
} from "@/routes/feedback-category/entities/feedback-category.entity";
import {
  UserEntity,
  UserEntitySchema,
  UserExtended,
  userInclude,
} from "@/routes/user/entities/user.entity";
import { Feedback, FeedbackCategory, Prisma } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";

export const feedbackInclude = {
  include: {
    professor: { ...userInclude },
    categories: true,
  },
};

export type FeedbackExtended = Feedback & {
  professor: UserExtended;
  categories: FeedbackCategory[];
};

export const FeedbackEntitySchema = Type.Object({
  id: Type.Integer(),
  submissionId: Type.Integer(),
  professor: UserEntitySchema,
  selectedIdx: Type.Any(),
  selectedSourceText: Type.Boolean(),
  comment: Type.Union([Type.Null(), Type.String()]),
  categories: Type.Array(FeedbackCategoryEntitySchema),
  staged: Type.Boolean(),
});

export class FeedbackEntity implements Static<typeof FeedbackEntitySchema> {
  id: number;
  submissionId: number;
  professor: UserEntity;
  selectedIdx: Prisma.JsonValue;
  selectedSourceText: boolean;
  comment: string | null;
  categories: FeedbackCategoryEntity[];
  staged: boolean;

  constructor(feedback: FeedbackExtended) {
    this.id = feedback.id;
    this.submissionId = feedback.submissionId;
    this.professor = new UserEntity(feedback.professor);
    this.selectedIdx = feedback.selectedIdx;
    this.selectedSourceText = feedback.selectedSourceText;
    this.comment = feedback.comment;
    this.categories = feedback.categories;
    this.staged = feedback.staged;
  }
}
