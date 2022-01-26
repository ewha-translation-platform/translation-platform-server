import Fastify from "fastify";
const server = Fastify();
const PORT = 5000;

server.get("/", (_, reply) => {
  reply.send("Hello world!");
});

server
  .listen(PORT)
  .then(() => console.log(`listening on port ${PORT}...`))
  .catch(console.error);
