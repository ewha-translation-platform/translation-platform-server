import { Semester } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";

export const CreateCourseDtoSchema = Type.Object({
  year: Type.Integer(),
  semester: Type.Enum(Semester),
  departmentId: Type.Integer(),
  code: Type.String(),
  name: Type.String(),
});
export type CreateCourseDto = Static<typeof CreateCourseDtoSchema>;
