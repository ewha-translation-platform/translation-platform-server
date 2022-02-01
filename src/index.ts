import envOpt from "@/config";
import { fastifyEnv, fastifyHelmet, prismaPlugin } from "@/plugins";
import {
  assignmentRoute,
  classRoute,
  courseRoute,
  feedbackCategoryRoute,
  feedbackRoute,
  routeServices,
  submissionRoute,
  userRoute,
} from "@/routes";
import Fastify from "fastify";
import fastifyCors from "fastify-cors";
import middie from "middie";
import morgan from "morgan";

async function bootstrap() {
  const server = Fastify();

  server.register(fastifyCors);
  server.register(fastifyHelmet);
  server.register(fastifyEnv, envOpt);
  server.register(prismaPlugin);
  await server.register(middie);
  server.use(morgan("dev"));

  await server.register(routeServices);
  server.register(userRoute, { prefix: "/users" });
  server.register(courseRoute, { prefix: "/courses" });
  server.register(classRoute, { prefix: "/classes" });
  server.register(assignmentRoute, { prefix: "/assignments" });
  server.register(feedbackCategoryRoute, { prefix: "/feedback-categories" });
  server.register(feedbackRoute, { prefix: "/feedbacks" });
  server.register(submissionRoute, { prefix: "/submissions" });

  await server.ready();
  await server.listen(server.config.PORT, "0.0.0.0");
  console.log(`listening on port ${server.config.PORT}`);
}

bootstrap();
