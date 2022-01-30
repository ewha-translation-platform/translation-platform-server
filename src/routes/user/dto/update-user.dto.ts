import { Static, Type } from "@sinclair/typebox";
import { CreateUserDtoSchema } from "./create-user.dto";

export const UpdateUserDtoSchema = Type.Partial(CreateUserDtoSchema);
export type UpdateUserDto = Static<typeof UpdateUserDtoSchema>;
