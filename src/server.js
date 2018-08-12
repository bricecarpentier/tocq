const fastify = require('fastify')();
const fastifyLevelDB = require('fastify-leveldb');

const commands = require('./commands');
const app = require('./plugins/app');
const levelLogs = require('./plugins/logs');


fastify.register(fastifyLevelDB, { name: 'DB' });
fastify.register(levelLogs, { valueEncoding: 'json' });
fastify.register(app, { commands });


fastify.listen(process.env.PORT, err => {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});
