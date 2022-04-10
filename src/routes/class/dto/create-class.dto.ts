import { Static, Type } from "@sinclair/typebox";

export const CreateClassDtoSchema = Type.Object({
  courseId: Type.Integer(),
  classNumber: Type.Integer(),
  professorIds: Type.Array(Type.Integer()),
});
export type CreateClassDto = Static<typeof CreateClassDtoSchema>;
