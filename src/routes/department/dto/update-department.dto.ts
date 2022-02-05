import { Static, Type } from "@sinclair/typebox";

export const UpdateDepartmentDtoSchema = Type.Object({
  name: Type.String(),
  collegeName: Type.String(),
});
export type UpdateDepartmentDto = Static<typeof UpdateDepartmentDtoSchema>;
