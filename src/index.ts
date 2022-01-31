import envOpt from "@/config";
import { fastifyEnv, fastifyHelmet, prismaPlugin } from "@/plugins";
import {
  assignmentRoute,
  classRoute,
  courseRoute,
  FeedbackCategoryRoute,
  userRoute,
} from "@/routes";
import Fastify from "fastify";
import middie from "middie";
import morgan from "morgan";

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
  server.register(FeedbackCategoryRoute, { prefix: "/feedback-categories" });

  await server.ready();
  await server.listen(server.config.PORT, "0.0.0.0");
  console.log(`listening on port ${server.config.PORT}`);
}

bootstrap();
