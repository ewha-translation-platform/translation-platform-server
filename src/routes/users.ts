import { FastifyPluginAsync } from "fastify";

const usersRoute: FastifyPluginAsync = async (server) => {
  server.get("/", async () => {
    const users = await server.prisma.user.findMany({ select });
    return users;
  });

  server.get<{ Params: { id: string } }>("/:id", async (request) => {
    const user = await server.prisma.user.findUnique({
      where: { id: +request.params.id },
      select,
    });
    return user;
  });

  const select = {
    academicId: true,
    firstName: true,
    lastName: true,
    email: true,
    department: {
      select: {
        name: true,
        college: { select: { name: true } },
      },
    },
    isAdmin: true,
    role: true,
    attendingClass: true,
    assistingClass: true,
    instructingClass: true,
    submissions: true,
    feedbacks: true,
  };
};

export default usersRoute;
