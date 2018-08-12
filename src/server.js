const fastify = require('fastify')();
const fastifyLevelDB = require('fastify-leveldb');

const commands = require('./commands');
const fastifySSE = require('./plugins/sse');


fastify.register(fastifyLevelDB, { name: 'DB' });
fastify.register(fastifySSE, {
  path: '/subscribe',
  handle: commands.subscribe,
});


fastify.get('/status', commands.status);
fastify.post('/append', commands.append);


fastify.listen(process.env.PORT, err => {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});
