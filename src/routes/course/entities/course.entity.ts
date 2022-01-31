import { Course, Semester } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";

export const courseInclude = {
  include: {
    department: {
      select: { name: true, college: { select: { name: true } } },
    },
  },
};

export type CourseExtended = Course & {
  department: { name: string; college: { name: string } };
};

export const CourseEntitySchema = Type.Object({
  id: Type.Integer(),
  year: Type.Integer(),
  semester: Type.Enum(Semester),
  department: Type.String(),
  college: Type.String(),
  code: Type.String(),
  name: Type.String(),
});

export class CourseEntity implements Static<typeof CourseEntitySchema> {
  id: number;
  year: number;
  semester: Semester;
  department: string;
  college: string;
  code: string;
  name: string;

  constructor(course: CourseExtended) {
    this.id = course.id;
    this.year = course.year;
    this.semester = course.semester;
    this.department = course.department.name;
    this.college = course.department.college.name;
    this.code = course.code;
    this.name = course.name;
  }
}
