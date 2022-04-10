import { Static, Type } from "@sinclair/typebox";
import { CreateUserDtoSchema } from "./create-user.dto";

export const UpdateUserDtoSchema = Type.Intersect([
  Type.Partial(CreateUserDtoSchema),
  Type.Partial(
    Type.Object({
      academicId: Type.Union([Type.Null(), Type.String()]),
    })
  ),
]);

export type UpdateUserDto = Static<typeof UpdateUserDtoSchema>;
