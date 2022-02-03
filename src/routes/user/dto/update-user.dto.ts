import { Static, Type } from "@sinclair/typebox";
import { CreateUserDtoSchema } from "./create-user.dto";

export const UpdateUserDtoSchema = Type.Partial(
  Type.Omit(CreateUserDtoSchema, ["id"])
);
export type UpdateUserDto = Static<typeof UpdateUserDtoSchema>;
