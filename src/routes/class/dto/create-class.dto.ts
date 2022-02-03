import { Static, Type } from "@sinclair/typebox";

export const CreateClassDtoSchema = Type.Object({
  courseId: Type.Integer(),
  classNumber: Type.Integer(),
  studentIds: Type.Array(Type.String()),
  professorIds: Type.Array(Type.String()),
});
export type CreateClassDto = Static<typeof CreateClassDtoSchema>;
