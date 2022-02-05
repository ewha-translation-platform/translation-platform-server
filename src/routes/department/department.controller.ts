import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import departmentService from "./department.service";
import {
  CreateDepartmentDto,
  CreateDepartmentDtoSchema,
} from "./dto/create-department.dto";
import {
  UpdateDepartmentDto,
  UpdateDepartmentDtoSchema,
} from "./dto/update-department.dto";
import {
  DepartmentEntity,
  DepartmentEntitySchema,
} from "./entities/department.entity";

export default async function (server: FastifyInstance) {
  await server.register(departmentService);

  server.get("/", {
    schema: {
      response: { 200: Type.Array(DepartmentEntitySchema) },
    },
    async handler(): Promise<DepartmentEntity[]> {
      const data = await server.departmentService.findAll({});
      return data.map((d) => new DepartmentEntity(d));
    },
  });

  const ParamsSchema = Type.Object({ id: Type.Number() });
  type Params = Static<typeof ParamsSchema>;
  server.get<{ Params: Params }>("/:id", {
    schema: {
      params: ParamsSchema,
      response: { 200: DepartmentEntitySchema },
    },
    async handler({ params: { id } }): Promise<DepartmentEntity> {
      const data = await server.departmentService.findOne({ id });
      return new DepartmentEntity(data);
    },
  });

  server.post<{ Body: CreateDepartmentDto }>("/", {
    schema: {
      body: CreateDepartmentDtoSchema,
      response: { 201: DepartmentEntitySchema },
    },
    async handler({ body }, reply): Promise<DepartmentEntity> {
      const { collegeName, ...rest } = body;
      const data = await server.departmentService.create({
        ...rest,
        college: {
          connectOrCreate: {
            where: { name: collegeName },
            create: { name: collegeName },
          },
        },
      });
      reply.code(201);
      return new DepartmentEntity(data);
    },
  });

  server.patch<{ Params: Params; Body: UpdateDepartmentDto }>("/:id", {
    schema: { params: ParamsSchema, body: UpdateDepartmentDtoSchema },
    async handler({ params: { id }, body }): Promise<DepartmentEntity> {
      const data = await server.departmentService.update(id, body);
      return new DepartmentEntity(data);
    },
  });

  server.delete<{ Params: Params }>("/:id", {
    schema: { params: ParamsSchema },
    async handler({ params: { id } }): Promise<DepartmentEntity> {
      const data = await server.departmentService.delete(id);
      return new DepartmentEntity(data);
    },
  });
}
