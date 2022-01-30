import { Static, Type } from "@sinclair/typebox";
import { CreateAssignmentDtoSchema } from "./create-assignment.dto";

export const UpdateAssignmentDtoSchema = Type.Partial(
  CreateAssignmentDtoSchema
);
export type UpdateAssignmentDto = Static<typeof UpdateAssignmentDtoSchema>;
