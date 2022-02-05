import { Static, Type } from "@sinclair/typebox";

export const CreateDepartmentDtoSchema = Type.Object({
  name: Type.String(),
  collegeName: Type.String(),
});
export type CreateDepartmentDto = Static<typeof CreateDepartmentDtoSchema>;
