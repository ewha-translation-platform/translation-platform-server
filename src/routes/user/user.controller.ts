import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { CreateUserDto, CreateUserDtoSchema } from "./dto/create-user.dto";
import { UpdateUserDto, UpdateUserDtoSchema } from "./dto/update-user.dto";
import { UserEntity, UserEntitySchema } from "./entities/user.entity";
import userService from "./user.service";

export default async function (server: FastifyInstance) {
  await server.register(userService);

  server.get("/", {
    schema: {
      response: { 200: Type.Array(UserEntitySchema) },
    },
    async handler(): Promise<UserEntity[]> {
      const data = await server.userService.findAll({});
      return data.map((d) => new UserEntity(d));
    },
  });

  const ParamsSchema = Type.Object({ id: Type.Number() });
  type Params = Static<typeof ParamsSchema>;
  server.get<{ Params: Params }>("/:id", {
    schema: {
      params: ParamsSchema,
      response: { 200: UserEntitySchema },
    },
    async handler({ params: { id } }): Promise<UserEntity> {
      const data = await server.userService.findOne({ id });
      return new UserEntity(data);
    },
  });

  server.post<{ Body: CreateUserDto }>("/", {
    schema: {
      body: CreateUserDtoSchema,
      response: { 201: UserEntitySchema },
    },
    async handler({ body }, reply): Promise<UserEntity> {
      const { departmentId, ...rest } = body;
      const data = await server.userService.create({
        ...rest,
        department: { connect: { id: departmentId } },
        isAdmin: false,
      });
      reply.code(201);
      return new UserEntity(data);
    },
  });

  server.patch<{ Params: Params; Body: UpdateUserDto }>("/:id", {
    schema: { params: ParamsSchema, body: UpdateUserDtoSchema },
    async handler({ params: { id }, body }): Promise<UserEntity> {
      const data = await server.userService.update(id, body);
      return new UserEntity(data);
    },
  });

  server.delete<{ Params: Params }>("/:id", {
    schema: { params: ParamsSchema },
    async handler({ params: { id } }): Promise<UserEntity> {
      const data = await server.userService.delete(id);
      return new UserEntity(data);
    },
  });
}
