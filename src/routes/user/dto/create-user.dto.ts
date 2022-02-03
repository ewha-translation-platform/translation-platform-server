import { Role } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";

export const CreateUserDtoSchema = Type.Object({
  id: Type.String(),
  firstName: Type.String(),
  lastName: Type.String(),
  email: Type.String({ format: "email" }),
  password: Type.String(),
  departmentId: Type.Integer(),
  role: Type.Enum(Role),
});
export type CreateUserDto = Static<typeof CreateUserDtoSchema>;
