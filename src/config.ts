import { fastifyEnvOpt } from "fastify-env";

declare module "fastify" {
  interface FastifyInstance {
    config: { PORT: number };
  }
}

const options: fastifyEnvOpt = {
  dotenv: true,
  schema: {
    type: "object",
    required: ["PORT"],
    properties: {
      PORT: {
        type: "number",
        default: 3000,
      },
    },
  },
};

export default options;
