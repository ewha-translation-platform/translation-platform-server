import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { UserEntity } from "@/routes/user/entities/user.entity";
import { AssignmentEntity } from "@/routes/assignment/entities/assignment.entity";
import { CreateClassDto, CreateClassDtoSchema } from "./dto/create-class.dto";
import { UpdateClassDto, UpdateClassDtoSchema } from "./dto/update-class.dto";
import { ClassEntity, ClassEntitySchema } from "./entities/class.entity";

export default async function (server: FastifyInstance) {
  server.get("/", {
    schema: {
      response: { 200: Type.Array(ClassEntitySchema) },
    },
    async handler(): Promise<ClassEntity[]> {
      const data = await server.classService.findAll({});
      return data.map((d) => new ClassEntity(d));
    },
  });

  const ParamsSchema = Type.Object({ id: Type.Number() });
  type Params = Static<typeof ParamsSchema>;
  server.get<{ Params: Params }>("/:id", {
    schema: {
      params: ParamsSchema,
      response: { 200: ClassEntitySchema },
    },
    async handler({ params: { id } }): Promise<ClassEntity> {
      const data = await server.classService.findOne({ id });
      return new ClassEntity(data);
    },
  });

  server.post<{ Body: CreateClassDto }>("/", {
    schema: {
      body: CreateClassDtoSchema,
      response: { 201: ClassEntitySchema },
    },
    async handler({ body }, reply): Promise<ClassEntity> {
      const { courseId, studentIds, professorIds, ...rest } = body;
      const data = await server.classService.create({
        ...rest,
        course: { connect: { id: courseId } },
        students: {
          create: studentIds.map((id) => ({ student: { connect: { id } } })),
        },
        professors: {
          create: professorIds.map((id) => ({
            professor: { connect: { id } },
          })),
        },
      });
      reply.code(201);
      return new ClassEntity(data);
    },
  });

  server.patch<{ Params: Params; Body: UpdateClassDto }>("/:id", {
    schema: { params: ParamsSchema, body: UpdateClassDtoSchema },
    async handler({ params: { id }, body }): Promise<ClassEntity> {
      const data = await server.classService.update(id, body);
      return new ClassEntity(data);
    },
  });

  server.delete<{ Params: Params }>("/:id", {
    schema: { params: ParamsSchema },
    async handler({ params: { id } }): Promise<ClassEntity> {
      const data = await server.classService.delete(id);
      return new ClassEntity(data);
    },
  });

  server.get<{ Params: Params }>("/:id/students", {
    schema: { params: ParamsSchema },
    async handler({ params: { id } }, reply): Promise<UserEntity[]> {
      const data = await server.userService.findAll({
        attendingClass: { some: { classId: id } },
      });
      if (!data) return reply.code(404);
      return data.map((d) => new UserEntity(d));
    },
  });

  server.post<{ Params: Params; Body: { academicIds: string[] } }>(
    "/:id/students",
    {
      schema: {
        params: ParamsSchema,
        body: Type.Object({ academicIds: Type.Array(Type.String()) }),
      },
      async handler({ params: { id }, body }) {
        return { ok: true };
      },
    }
  );

  server.get<{ Params: Params }>("/:id/assignments", {
    schema: { params: ParamsSchema },
    async handler({ params: { id } }, reply): Promise<AssignmentEntity[]> {
      const data = await server.assignmentService.findAll({ classId: id });
      if (!data) return reply.code(404);
      return data.map((d) => new AssignmentEntity(d));
    },
  });
}
