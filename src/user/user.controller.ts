import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { CreateUserDto, CreateUserDtoSchema } from "./dto/create-user.dto";
import { UserEntity, UserEntitySchema } from "./entities/user.entity";
import userService from "./user.service";

export default async function (server: FastifyInstance) {
  await server.register(userService);

  server.get("/", {
    schema: {
      response: { 200: Type.Array(UserEntitySchema) },
    },
    async handler(): Promise<UserEntity[]> {
      return (await server.userService.findAll({})).map<UserEntity>((user) => ({
        ...user,
        department: user.department.name,
        college: user.department.college.name,
      }));
    },
  });

  const GetUserParamSchema = Type.Object({ id: Type.Number() });
  type GetUserParam = Static<typeof GetUserParamSchema>;
  server.get<{ Params: GetUserParam }>("/:id", {
    schema: {
      params: GetUserParamSchema,
      response: { 200: UserEntitySchema },
    },
    async handler({ params: { id } }): Promise<UserEntity> {
      const user = await server.userService.findOne({ id });
      return {
        ...user,
        department: user.department.name,
        college: user.department.college.name,
      };
    },
  });

  server.post<{ Body: CreateUserDto }>("/", {
    schema: {
      body: CreateUserDtoSchema,
      response: { 201: UserEntitySchema },
    },
    async handler({ body }): Promise<UserEntity> {
      const { departmentId, ...rest } = body;
      const user = await server.userService.create({
        ...rest,
        department: { connect: { id: departmentId } },
        isAdmin: false,
      });
      return {
        ...user,
        department: user.department.name,
        college: user.department.college.name,
      };
    },
  });

  const PatchUserParamSchema = Type.Object({ id: Type.Number() });
  type PatchUserParam = Static<typeof PatchUserParamSchema>;
  server.patch<{ Params: PatchUserParam }>("/:id", {
    schema: { params: PatchUserParamSchema },
    async handler() {
      return "This will update User";
    },
  });

  const DeleteUserParamSchema = Type.Object({ id: Type.Number() });
  type DeleteUserParam = Static<typeof DeleteUserParamSchema>;
  server.delete<{ Params: DeleteUserParam }>("/:id", {
    schema: { params: DeleteUserParamSchema },
    async handler() {
      return "This will delete User";
    },
  });
}
