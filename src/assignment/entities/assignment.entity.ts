import {
  FeedbackCategoryEntity,
  FeedbackCategoryEntitySchema,
} from "@/category/entities/category.entity";
import { Static, Type } from "@sinclair/typebox";
import { Assignment, AssignmentType, Prisma } from "@prisma/client";

type AssignmentExtended = Assignment & {
  feedbackCategories: FeedbackCategoryEntity[];
};

export const AssignmentEntitySchema = Type.Object({
  id: Type.Integer(),
  classId: Type.Integer(),
  name: Type.String(),
  description: Type.String(),
  weekNumber: Type.Integer(),
  dueDateTime: Type.String({ format: "date-time" }),
  assignmentType: Type.Enum(AssignmentType),
  isPublic: Type.Boolean(),
  maxScore: Type.Number(),
  feedbackCategories: Type.Array(FeedbackCategoryEntitySchema),
  textFile: Type.String(),
  audioFile: Type.Union([Type.Null(), Type.Any()]),
  sequentialRegions: Type.Union([Type.Null(), Type.Any()]),
  maxPlayCount: Type.Union([Type.Null(), Type.Integer()]),
  playbackRate: Type.Union([Type.Null(), Type.Number()]),
});

export class AssignmentEntity implements Static<typeof AssignmentEntitySchema> {
  id: number;
  classId: number;
  name: string;
  description: string;
  weekNumber: number;
  dueDateTime: string;
  assignmentType: AssignmentType;
  isPublic: boolean;
  maxScore: number;
  feedbackCategories: FeedbackCategoryEntity[];
  textFile: string;

  audioFile: Buffer | null;
  sequentialRegions: Prisma.JsonValue | null;
  maxPlayCount: number | null;
  playbackRate: number | null;

  constructor(assignment: AssignmentExtended) {
    this.id = assignment.id;
    this.classId = assignment.classId;
    this.name = assignment.name;
    this.description = assignment.description;
    this.weekNumber = assignment.weekNumber;
    this.dueDateTime = assignment.dueDateTime.toISOString();
    this.assignmentType = assignment.assignmentType;
    this.isPublic = assignment.isPublic;
    this.maxScore = assignment.maxScore;
    this.feedbackCategories = assignment.feedbackCategories;
    this.textFile = assignment.textFile;

    this.audioFile = assignment.audioFile;
    this.sequentialRegions = assignment.sequentialRegions;
    this.maxPlayCount = assignment.maxPlayCount;
    this.playbackRate = assignment.playbackRate;
  }
}
