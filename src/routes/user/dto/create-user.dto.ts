import { Role } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";

export const CreateUserDtoSchema = Type.Object({
  email: Type.String({ format: "email" }),
  firstName: Type.String(),
  lastName: Type.String(),
  password: Type.String(),
  departmentId: Type.Integer(),
  role: Type.Enum(Role),
});
export type CreateUserDto = Static<typeof CreateUserDtoSchema>;
