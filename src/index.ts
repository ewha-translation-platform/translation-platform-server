import Fastify from "fastify";
import middie from "middie";
import morgan from "morgan";
import envOpt from "./config";
import { courseRoute } from "./course";
import { fastifyEnv, fastifyHelmet, prismaPlugin } from "./plugins";
import { userRoute } from "./user";
import { classRoute } from "./class";
import { assignmentRoute } from "./assignment";

async function bootstrap() {
  const server = Fastify();

  server.register(fastifyHelmet);
  server.register(fastifyEnv, envOpt);
  server.register(prismaPlugin);
  await server.register(middie);
  server.use(morgan("dev"));

  server.register(userRoute, { prefix: "/users" });
  server.register(courseRoute, { prefix: "/courses" });
  server.register(classRoute, { prefix: "/classes" });
  server.register(assignmentRoute, { prefix: "/assignments" });

  await server.ready();
  await server.listen(server.config.PORT, "0.0.0.0");
  console.log(`listening on port ${server.config.PORT}`);
}

bootstrap();
