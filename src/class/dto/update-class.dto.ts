import { Static, Type } from "@sinclair/typebox";
import { CreateClassDtoSchema } from "./create-class.dto";

export const UpdateClassDtoSchema = Type.Partial(CreateClassDtoSchema);
export type UpdateClassDto = Static<typeof UpdateClassDtoSchema>;
