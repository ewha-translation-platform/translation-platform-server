import {
  UpdateCourseDto,
  UpdateCourseDtoSchema,
} from "./dto/update-course.dto";
import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import courseService from "./course.service";
import {
  CreateCourseDto,
  CreateCourseDtoSchema,
} from "./dto/create-course.dto";
import { CourseEntity, CourseEntitySchema } from "./entities/course.entity";

export default async function (server: FastifyInstance) {
  await server.register(courseService);

  server.get("/", {
    schema: {
      response: { 200: Type.Array(CourseEntitySchema) },
    },
    async handler(): Promise<CourseEntity[]> {
      const courses = await server.courseService.findAll({});
      return courses.map((c) => new CourseEntity(c));
    },
  });

  const ParamsSchema = Type.Object({ id: Type.Number() });
  type Params = Static<typeof ParamsSchema>;
  server.get<{ Params: Params }>("/:id", {
    schema: {
      params: ParamsSchema,
      response: { 200: CourseEntitySchema },
    },
    async handler({ params: { id } }): Promise<CourseEntity> {
      const course = await server.courseService.findOne({ id });
      return new CourseEntity(course);
    },
  });

  server.post<{ Body: CreateCourseDto }>("/", {
    schema: {
      body: CreateCourseDtoSchema,
      response: { 201: CourseEntitySchema },
    },
    async handler({ body }, reply): Promise<CourseEntity> {
      const { departmentId, ...rest } = body;
      const course = await server.courseService.create({
        ...rest,
        department: { connect: { id: departmentId } },
      });
      reply.code(201);
      return new CourseEntity(course);
    },
  });

  server.patch<{ Params: Params; Body: UpdateCourseDto }>("/:id", {
    schema: { params: ParamsSchema, body: UpdateCourseDtoSchema },
    async handler({ params: { id }, body }): Promise<CourseEntity> {
      const course = await server.courseService.update(id, body);
      return new CourseEntity(course);
    },
  });

  server.delete<{ Params: Params }>("/:id", {
    schema: { params: ParamsSchema },
    async handler({ params: { id } }): Promise<CourseEntity> {
      const course = await server.courseService.delete(id);
      return new CourseEntity(course);
    },
  });
}
