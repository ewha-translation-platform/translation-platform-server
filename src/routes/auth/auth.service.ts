import { User } from "@prisma/client";
import { FastifyReply } from "fastify";
import fp from "fastify-plugin";
import { BadRequest } from "http-errors";
import { CreateUserDto } from "../user/dto/create-user.dto";

declare module "fastify" {
  interface FastifyInstance {
    authService: IAuthService;
  }
}

interface IAuthService {
  register(createUserDto: CreateUserDto): Promise<User>;
  login(id: string, password: string): Promise<User>;
  setRefreshTokenCookie(reply: FastifyReply, user: User): void;
  clearRefreshTokenCookie(reply: FastifyReply): void;
}

export default fp(async (server) => {
  class AuthService implements IAuthService {
    async register({
      password,
      departmentId,
      ...createUserDto
    }: CreateUserDto) {
      return await server.userService.create({
        ...createUserDto,
        password: await server.bcrypt.hash(password),
        department: { connect: { id: departmentId } },
        isAdmin: false,
      });
    }

    async login(id: string, password: string) {
      const user = await server.userService.findOne({ id });

      if (!user || !(await server.bcrypt.compare(password, user.password)))
        throw new BadRequest(
          "존재하지 않는 사용자이거나 일치하지 않는 비밀번호입니다."
        );

      return user;
    }

    setRefreshTokenCookie(reply: FastifyReply, user: User) {
      reply.setCookie("jid", server.createRefreshToken(user), {
        maxAge: server.config.REFRESH_TOKEN_EXPIRATION_TIME,
        secure: true,
        path: "/api/auth/refresh-token",
        httpOnly: true,
      });
    }

    clearRefreshTokenCookie(reply: FastifyReply) {
      reply.clearCookie("jid", {
        secure: true,
        path: "/api/auth/refresh-token",
        httpOnly: true,
      });
    }
  }

  server.decorate("authService", new AuthService());
});
