import { Static, Type } from "@sinclair/typebox";
import { CreateFeedbackDtoSchema } from "./create-feedback.dto";

export const UpdateFeedbackDtoSchema = Type.Partial(CreateFeedbackDtoSchema);
export type UpdateFeedbackDto = Static<typeof UpdateFeedbackDtoSchema>;
