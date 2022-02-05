import { College, Department } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";

export const CollegeEntitySchema = Type.Object({
  id: Type.Integer(),
  name: Type.String(),
});

export class CollegeEntity implements Static<typeof CollegeEntitySchema> {
  id: number;
  name: string;

  constructor(college: College) {
    this.id = college.id;
    this.name = college.name;
  }
}

export const departmentInclude = {
  include: {
    college: true,
  },
};

export const DepartmentEntitySchema = Type.Object({
  id: Type.Integer(),
  name: Type.String(),
  college: CollegeEntitySchema,
});

export class DepartmentEntity implements Static<typeof DepartmentEntitySchema> {
  id: number;
  name: string;
  college: CollegeEntity;

  constructor(department: Department & { college: College }) {
    this.id = department.id;
    this.name = department.name;
    this.college = department.college;
  }
}
