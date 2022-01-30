import { UpdateClassDto, UpdateClassDtoSchema } from "./dto/update-class.dto";
import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import classService from "./class.service";
import { CreateClassDto, CreateClassDtoSchema } from "./dto/create-class.dto";
import { ClassEntity, ClassEntitySchema } from "./entities/class.entity";

export default async function (server: FastifyInstance) {
  await server.register(classService);

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
      const { courseId, ...rest } = body;
      const data = await server.classService.create({
        ...rest,
        course: { connect: { id: courseId } },
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
}
