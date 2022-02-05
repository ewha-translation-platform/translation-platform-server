import { Course, Semester } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";

export const courseInclude = {
  include: {
    department: {
      include: { college: true },
    },
  },
};

export type CourseExtended = Course & {
  department: {
    id: number;
    name: string;
    college: { id: number; name: string };
  };
};

export const CourseEntitySchema = Type.Object({
  id: Type.Integer(),
  year: Type.Integer(),
  semester: Type.Enum(Semester),
  department: Type.Object({
    id: Type.Number(),
    name: Type.String(),
    college: Type.Object({ id: Type.Number(), name: Type.String() }),
  }),
  code: Type.String(),
  name: Type.String(),
});

export class CourseEntity implements Static<typeof CourseEntitySchema> {
  id: number;
  year: number;
  semester: Semester;
  department: {
    id: number;
    name: string;
    college: { id: number; name: string };
  };
  code: string;
  name: string;

  constructor(course: CourseExtended) {
    this.id = course.id;
    this.year = course.year;
    this.semester = course.semester;
    this.department = course.department;
    this.code = course.code;
    this.name = course.name;
  }
}
