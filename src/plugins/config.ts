export { default as fastifyEnv } from "fastify-env";
import { Type, Static } from "@sinclair/typebox";

const schema = Type.Object({
  PORT: Type.Number(),
  ENV: Type.Union([Type.Literal("prod"), Type.Literal("dev")]),
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
