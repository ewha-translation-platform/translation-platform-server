import {
  authPlugin,
  fastifyBcrypt,
  fastifyCookie,
  fastifyCors,
  fastifyEnv,
  fastifyEnvOpt,
  fastifyHelmet,
  fastifyMultipart,
  fastifySwagger,
  prismaPlugin,
  fastifyStatic,
} from "@/plugins";
import {
  assignmentRoute,
  authRoute,
  classRoute,
  courseRoute,
  departmentRoute,
  feedbackCategoryRoute,
  feedbackRoute,
  routeServices,
  submissionRoute,
  userRoute,
} from "@/routes";
import Fastify from "fastify";
import { BadRequest, NotFound, Unauthorized, Forbidden } from "http-errors";
import middie from "middie";
import morgan from "morgan";
import path from "path";

async function bootstrap() {
  const server = Fastify();

  await server.register(fastifyEnv, fastifyEnvOpt);
  server.register(fastifyMultipart, {
    attachFieldsToBody: true,
    sharedSchemaId: "#multiPartSchema",
  });

  server.register(fastifyStatic, {
    root: path.join(__dirname, "public"),
    wildcard: false,
  });

  server.register(fastifyBcrypt, { saltWorkFactor: 10 });

  if (server.config.ENV === "prod") {
    server.register(fastifyHelmet, { contentSecurityPolicy: false });
  }

  if (server.config.ENV === "dev") {
    server.register(fastifyCors, {
      origin: "http://localhost:3000",
      credentials: true,
    });
  }

  await server.register(fastifyCookie);

  await server.register(middie);
  server.use(morgan("dev"));

  await server.register(prismaPlugin);

  server.register(fastifySwagger, {
    exposeRoute: true,
    routePrefix: "/doc",
    swagger: { info: { title: "Translation Platform", version: "0.1.0" } },
  });

  await server.register(routeServices);

  await server.register(authPlugin);

  server.register(authRoute, { prefix: "/api/auth" });
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

  server.get("/*", (_req, reply) => {
    reply.sendFile("index.html");
  });

  server.setErrorHandler((error, _req, reply) => {
    if (error instanceof NotFound) {
      reply.code(404).send({ ok: false, message: error.message });
    } else if (error instanceof BadRequest) {
      reply.code(400).send({ ok: false, message: error.message });
    } else if (error instanceof Unauthorized) {
      reply.code(401).send({ ok: false, message: error.message });
    } else if (error instanceof Forbidden) {
      reply.code(403).send({ ok: false, message: error.message });
    } else {
      console.log(error);
      reply.code(500).send(error);
    }
  });

  await server.ready();
  await server.listen(server.config.PORT, "0.0.0.0");
  console.log(`listening on port ${server.config.PORT}`);
}

bootstrap();
