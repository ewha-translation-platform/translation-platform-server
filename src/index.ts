import {
  fastifyCors,
  fastifyEnv,
  fastifyEnvOpt,
  fastifyHelmet,
  fastifyMultipart,
  fastifySwagger,
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

  server.register(fastifySwagger, {
    exposeRoute: true,
    routePrefix: "/doc",
    swagger: { info: { title: "Translation Platform", version: "0.1.0" } },
  });

  await server.register(routeServices);
  server.register(departmentRoute, { prefix: "/api/departments" });
  server.register(userRoute, { prefix: "/api/users" });
  server.register(courseRoute, { prefix: "/api/courses" });
  server.register(classRoute, { prefix: "/api/classes" });
  server.register(assignmentRoute, { prefix: "/api/assignments" });
  server.register(feedbackCategoryRoute, {
    prefix: "/api/feedback-categories",
  });
  server.register(feedbackRoute, { prefix: "/api/feedbacks" });
  server.register(submissionRoute, { prefix: "/api/submissions" });

  server.setErrorHandler((error, request, reply) => {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      reply.status(500).send({ isPrismaError: true, error });
    } else {
      reply.status(500).send(error);
    }
  });

  await server.ready();
  await server.listen(server.config.PORT, "0.0.0.0");
  console.log(`listening on port ${server.config.PORT}`);
}

bootstrap();
