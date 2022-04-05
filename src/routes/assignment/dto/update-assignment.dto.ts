import { Static, Type } from "@sinclair/typebox";
import { CreateAssignmentDtoSchema } from "./create-assignment.dto";

export const UpdateAssignmentDtoSchema = Type.Intersect([
  Type.Partial(CreateAssignmentDtoSchema),
  Type.Partial(
    Type.Object({
      feedbackCategoryIds: Type.Array(Type.Integer()),
    })
  ),
]);
export type UpdateAssignmentDto = Static<typeof UpdateAssignmentDtoSchema>;
