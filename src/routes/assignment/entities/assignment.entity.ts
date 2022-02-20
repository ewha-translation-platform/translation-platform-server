import {
  FeedbackCategoryEntity,
  FeedbackCategoryEntitySchema,
} from "@/routes/feedback-category/entities/feedback-category.entity";
import { Static, Type } from "@sinclair/typebox";
import { Assignment, AssignmentType, Prisma } from "@prisma/client";

export const assignmentInclude = {
  include: {
    feedbackCategories: true,
  },
};

export type AssignmentExtended = Assignment & {
  feedbackCategories: FeedbackCategoryEntity[];
};

export const AssignmentEntitySchema = Type.Object({
  id: Type.Integer(),
  classId: Type.Integer(),
  name: Type.String(),
  description: Type.String(),
  keywords: Type.Union([Type.String(), Type.Null()]),
  weekNumber: Type.Integer(),
  dueDateTime: Type.String({ format: "date-time" }),
  assignmentType: Type.Enum(AssignmentType),
  isPublic: Type.Boolean(),
  feedbackCategories: Type.Array(FeedbackCategoryEntitySchema),
  textFile: Type.String(),
  sequentialRegions: Type.Union([Type.Null(), Type.Any()]),
  maxPlayCount: Type.Union([Type.Null(), Type.Integer()]),
  playbackRate: Type.Union([Type.Null(), Type.Number()]),
});

export class AssignmentEntity implements Static<typeof AssignmentEntitySchema> {
  id: number;
  classId: number;
  name: string;
  description: string;
  keywords: string | null;
  weekNumber: number;
  dueDateTime: string;
  assignmentType: AssignmentType;
  isPublic: boolean;
  feedbackCategories: FeedbackCategoryEntity[];
  textFile: string;

  sequentialRegions: Prisma.JsonValue | null;
  maxPlayCount: number | null;
  playbackRate: number | null;

  constructor(assignment: AssignmentExtended) {
    this.id = assignment.id;
    this.classId = assignment.classId;
    this.name = assignment.name;
    this.description = assignment.description;
    this.keywords = assignment.keywords;
    this.weekNumber = assignment.weekNumber;
    this.dueDateTime = assignment.dueDateTime.toISOString();
    this.assignmentType = assignment.assignmentType;
    this.isPublic = assignment.isPublic;
    this.feedbackCategories = assignment.feedbackCategories;
    this.textFile = assignment.textFile;

    this.sequentialRegions = assignment.sequentialRegions;
    this.maxPlayCount = assignment.maxPlayCount;
    this.playbackRate = assignment.playbackRate;
  }
}
