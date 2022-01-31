import {
  AssignmentEntity,
  AssignmentEntitySchema,
  AssignmentExtended,
  assignmentInclude,
} from "@/routes/assignment/entities/assignment.entity";
import {
  FeedbackEntity,
  FeedbackEntitySchema,
  FeedbackExtended,
  feedbackInclude,
} from "@/routes/feedback/entities/feedback.entity";
import {
  UserEntity,
  UserEntitySchema,
  UserExtended,
  userInclude,
} from "@/routes/user/entities/user.entity";
import { Submission } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";

export const submissionInclude = {
  include: {
    student: { ...userInclude },
    assignment: { ...assignmentInclude },
    feedbacks: { ...feedbackInclude },
  },
};

type SubmissionExtended = Submission & {
  student: UserExtended;
  assignment: AssignmentExtended;
  feedbacks: FeedbackExtended[];
};

export const SubmissionEntitySchema = Type.Object({
  id: Type.Integer(),
  student: UserEntitySchema,
  assignment: AssignmentEntitySchema,
  textFile: Type.String(),
  staged: Type.Boolean(),
  generalReview: Type.Union([Type.Null(), Type.String()]),
  score: Type.Union([Type.Null(), Type.Number()]),
  feedbacks: Type.Array(FeedbackEntitySchema),
  graded: Type.Boolean(),

  audioFile: Type.Union([Type.Null(), Type.Any()]),
  playCount: Type.Union([Type.Null(), Type.Integer()]),
  playbackRate: Type.Union([Type.Null(), Type.Number()]),
});

export class SubmissionEntity implements Static<typeof SubmissionEntitySchema> {
  id: number;
  student: UserEntity;
  assignment: AssignmentEntity;
  textFile: string;
  feedbacks: FeedbackEntity[];
  score: number | null;
  staged: boolean;
  generalReview: string | null;
  graded: boolean;

  audioFile: Buffer | null;
  playCount: number | null;
  playbackRate: number | null;

  constructor(submission: SubmissionExtended) {
    this.id = submission.id;
    this.student = new UserEntity(submission.student);
    this.assignment = new AssignmentEntity(submission.assignment);
    this.textFile = submission.textFile;
    this.feedbacks = submission.feedbacks.map((f) => new FeedbackEntity(f));
    this.score = submission.score;
    this.staged = submission.staged;
    this.generalReview = submission.generalReview;
    this.graded = submission.graded;

    this.audioFile = submission.audioFile;
    this.playCount = submission.playCount;
    this.playbackRate = submission.playbackRate;
  }
}
