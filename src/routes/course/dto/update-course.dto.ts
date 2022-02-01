import { Semester } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";

export const UpdateCourseDtoSchema = Type.Partial(
  Type.Object({
    year: Type.Integer(),
    semester: Type.Enum(Semester),
    departmentId: Type.Integer(),
    code: Type.String(),
    name: Type.String(),
  })
);
export type UpdateCourseDto = Static<typeof UpdateCourseDtoSchema>;
