import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance } from "fastify";
import { BadRequest, NotFound } from "http-errors";
import {
  CreateUserDto,
  CreateUserDtoSchema,
} from "../user/dto/create-user.dto";

const BodySchema = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String(),
});
type Body = Static<typeof BodySchema>;

export default async function (server: FastifyInstance) {
  server.post<{ Body: CreateUserDto }>("/register", {
    schema: { body: CreateUserDtoSchema },
    async handler({ body: createUserDto }, reply) {
      const user = await this.authService.register(createUserDto);

      this.authService.setRefreshTokenCookie(reply, user);
      return { accessToken: server.createAccessToken(user) };
    },
  });

  server.post<{ Body: Body }>("/login", {
    schema: { body: BodySchema },
    async handler(req, reply) {
      try {
        console.log(req.body);
        const { email, password } = req.body;

        const user = await server.authService.login(email, password);

        this.authService.setRefreshTokenCookie(reply, user);
        return { accessToken: server.createAccessToken(user) };
      } catch (error) {
        if (error instanceof Error) {
          throw new BadRequest(error.message);
        }
      }
    },
  });

  server.post("/logout", {
    async handler(_req, reply) {
      this.authService.clearRefreshTokenCookie(reply);
      return { ok: true };
    },
  });

  server.post("/refresh-token", {
    async handler(req, reply) {
      const refreshToken = req.cookies["jid"];
      if (!refreshToken) throw new BadRequest("No refresh token");

      const { id, tokenVersion } = server.jwt.verify(refreshToken);

      const user = await this.userService.findOne({ id });
      if (!user) throw new NotFound("존재하지 않는 사용자입니다.");
      if (user.tokenVersion !== +tokenVersion)
        throw new BadRequest("Token version doesn't match");

      this.authService.setRefreshTokenCookie(reply, user);
      return { accessToken: server.createAccessToken(user) };
    },
  });
}
