import { Semester } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";

export const UpdateCourseDtoSchema = Type.Object({
  year: Type.Optional(Type.Integer()),
  semester: Type.Optional(Type.Enum(Semester)),
  departmentId: Type.Optional(Type.Integer()),
  code: Type.Optional(Type.String()),
  name: Type.Optional(Type.String()),
});
export type UpdateCourseDto = Static<typeof UpdateCourseDtoSchema>;
