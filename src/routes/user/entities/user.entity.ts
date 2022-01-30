import { Role } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";

export const UserEntitySchema = Type.Object({
  id: Type.Integer(),
  academicId: Type.String(),
  firstName: Type.String(),
  lastName: Type.String(),
  email: Type.String(),
  department: Type.String(),
  college: Type.String(),
  role: Type.Enum(Role),
  isAdmin: Type.Boolean(),
});

export type UserEntity = Static<typeof UserEntitySchema>;
