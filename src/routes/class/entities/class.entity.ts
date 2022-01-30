import {
  CourseEntity,
  CourseEntitySchema,
  CourseExtended,
} from "@/routes/course/entities/course.entity";
import { Class } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";

export const ClassEntitySchema = Type.Object({
  id: Type.Integer(),
  course: CourseEntitySchema,
  classNumber: Type.Integer(),
});

export class ClassEntity implements Static<typeof ClassEntitySchema> {
  id: number;
  course: CourseEntity;
  classNumber: number;

  constructor(classObj: Class & { course: CourseExtended }) {
    this.id = classObj.id;
    this.course = new CourseEntity(classObj.course);
    this.classNumber = classObj.classNumber;
  }
}
