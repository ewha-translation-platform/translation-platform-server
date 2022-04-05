export { default as fastifyEnv } from "fastify-env";
import { Type, Static } from "@sinclair/typebox";

const schema = Type.Object({
  PORT: Type.Number(),
  ENV: Type.Union([Type.Literal("prod"), Type.Literal("dev")]),
  JWT_TOKEN_SECRET: Type.String(),
  ACCESS_TOKEN_EXPIRATION_TIME: Type.Number(),
  REFRESH_TOKEN_EXPIRATION_TIME: Type.Number(),
  STT_SERVER_PORT: Type.Number(),
});

declare module "fastify" {
  interface FastifyInstance {
    config: Static<typeof schema>;
  }
}

export const fastifyEnvOpt = {
  dotenv: true,
  schema: Type.Strict(schema),
};
