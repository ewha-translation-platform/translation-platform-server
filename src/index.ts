import Fastify from "fastify";
import middie from "middie";
import morgan from "morgan";
import envOpt from "./config";
import { fastifyEnv, fastifyHelmet, prismaPlugin } from "./plugins";
import { usersRoute } from "./routes";

async function bootstrap() {
  const server = Fastify();

  server.register(fastifyHelmet);
  server.register(fastifyEnv, envOpt);
  server.register(prismaPlugin);
  await server.register(middie);
  server.use(morgan("dev"));

  server.register(usersRoute, { prefix: "/users" });

  await server.ready();
  await server.listen(server.config.PORT, "0.0.0.0");
  console.log(`listening on port ${server.config.PORT}`);
}

bootstrap();
