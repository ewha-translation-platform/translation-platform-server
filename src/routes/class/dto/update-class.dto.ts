import { Static, Type } from "@sinclair/typebox";

export const UpdateClassDtoSchema = Type.Partial(
  Type.Object({
    courseId: Type.Integer(),
    classNumber: Type.Integer(),
    studentIds: Type.Array(Type.Integer()),
    professorIds: Type.Array(Type.Integer()),
  })
);
export type UpdateClassDto = Static<typeof UpdateClassDtoSchema>;
