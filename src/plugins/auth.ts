import { User } from "@prisma/client";
import type { FastifyPluginAsync, preHandlerAsyncHookHandler } from "fastify";
import fastifyAuth from "fastify-auth";
import fastifyJwt from "fastify-jwt";
import fp from "fastify-plugin";
import { Forbidden, Unauthorized } from "http-errors";

declare module "fastify-jwt" {
  interface FastifyJWT {
    user: Pick<User, "id" | "role" | "firstName" | "lastName" | "isAdmin">;
  }
}

declare module "fastify" {
  interface FastifyInstance {
    verifyAccessToken: preHandlerAsyncHookHandler;
    createAccessToken: (user: User) => string;
    createRefreshToken: (user: User) => string;
    revokeRefreshToken: (user: User) => boolean;
    verifyProfessor: preHandlerAsyncHookHandler;
  }
}

const authPlugin: FastifyPluginAsync = fp(async (server) => {
  await server.register(fastifyAuth);
  await server.register(fastifyJwt, {
    secret: server.config.JWT_TOKEN_SECRET,
  });

  const verifyAccessToken: preHandlerAsyncHookHandler = async (req, reply) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      throw new Unauthorized("로그인이 필요합니다.");
    }

    try {
      await req.jwtVerify();
    } catch (error) {
      if (error instanceof Error) {
        throw new Forbidden(error.message);
      }
    }
  };

  const createAccessToken = ({
    id,
    role,
    firstName,
    lastName,
    isAdmin,
  }: User) => {
    const token = server.jwt.sign(
      {
        id,
        role,
        firstName,
        lastName,
        isAdmin,
      },
      { expiresIn: server.config.ACCESS_TOKEN_EXPIRATION_TIME }
    );
    return token;
  };

  const createRefreshToken = ({ id, tokenVersion }: User) => {
    const token = server.jwt.sign(
      { id, tokenVersion },
      { expiresIn: server.config.REFRESH_TOKEN_EXPIRATION_TIME }
    );
    return token;
  };

  const revokeRefreshToken = async (user: User) => {
    await server.userService.update(user.id, {
      tokenVersion: user.tokenVersion + 1,
    });
    return true;
  };

  const verifyProfessor: preHandlerAsyncHookHandler = async (req, _reply) => {
    if (req.user.role !== "PROFESSOR") throw new Forbidden();
  };

  server.decorate("verifyAccessToken", verifyAccessToken);
  server.decorate("createAccessToken", createAccessToken);
  server.decorate("createRefreshToken", createRefreshToken);
  server.decorate("revokeRefreshToken", revokeRefreshToken);
  server.decorate("verifyProfessor", verifyProfessor);
});

export default authPlugin;
