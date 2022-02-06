import {
  fastifyCors,
  fastifyEnv,
  fastifyEnvOpt,
  fastifyHelmet,
  fastifyMultipart,
  prismaPlugin,
} from "@/plugins";
import {
  assignmentRoute,
  classRoute,
  courseRoute,
  departmentRoute,
  feedbackCategoryRoute,
  feedbackRoute,
  routeServices,
  submissionRoute,
  userRoute,
} from "@/routes";
import { Prisma } from "@prisma/client";
import Fastify from "fastify";
import middie from "middie";
import morgan from "morgan";

async function bootstrap() {
  const server = Fastify();

  await server.register(fastifyEnv, fastifyEnvOpt);
  server.register(fastifyMultipart, {
    attachFieldsToBody: true,
    sharedSchemaId: "#multiPartSchema",
  });

  if (server.config.ENV === "prod") {
    server.register(fastifyHelmet);
  } else {
    server.register(fastifyCors);
  }

  await server.register(middie);
  server.use(morgan("dev"));

  await server.register(prismaPlugin);
  await server.register(routeServices);
  server.register(departmentRoute, { prefix: "/departments" });
  server.register(userRoute, { prefix: "/users" });
  server.register(courseRoute, { prefix: "/courses" });
  server.register(classRoute, { prefix: "/classes" });
  server.register(assignmentRoute, { prefix: "/assignments" });
  server.register(feedbackCategoryRoute, { prefix: "/feedback-categories" });
  server.register(feedbackRoute, { prefix: "/feedbacks" });
  server.register(submissionRoute, { prefix: "/submissions" });

  server.setErrorHandler((error, request, reply) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      reply.status(500).send({ isPrismaError: true, error });
    } else reply.status(500).send(error);
  });

  await server.ready();
  await server.listen(server.config.PORT, "0.0.0.0");
  console.log(`listening on port ${server.config.PORT}`);
}

bootstrap();
