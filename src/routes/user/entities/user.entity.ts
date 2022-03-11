import { Role, User } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";

export const userInclude = {
  include: {
    department: {
      select: { name: true, college: { select: { name: true } } },
    },
  },
};

export type UserExtended = User & {
  department: { name: string; college: { name: string } };
};

export const UserEntitySchema = Type.Object({
  id: Type.Integer(),
  email: Type.String({ format: "email" }),
  academicId: Type.Union([Type.Null(), Type.String()]),
  firstName: Type.String(),
  lastName: Type.String(),
  department: Type.String(),
  college: Type.String(),
  role: Type.Enum(Role),
  isAdmin: Type.Boolean(),
});

export class UserEntity implements Static<typeof UserEntitySchema> {
  id: number;
  email: string;
  academicId: string | null;
  firstName: string;
  lastName: string;
  department: string;
  college: string;
  role: Role;
  isAdmin: boolean;

  constructor(user: UserExtended) {
    this.id = user.id;
    this.email = user.email;
    this.academicId = user.academicId;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.department = user.department.name;
    this.college = user.department.college.name;
    this.role = user.role;
    this.isAdmin = user.isAdmin;
  }
}
