const fastify = require('fastify')();
const fastifyLevelDB = require('fastify-leveldb');

const commands = require('./commands');
const app = require('./plugins/app');
const levelLogs = require('./plugins/logs');


const dbName = process.env.DB_PATH || 'DB';

fastify.register(fastifyLevelDB, { name: dbName });
fastify.register(levelLogs, { valueEncoding: 'json' });
fastify.register(app, { commands });


fastify.listen(process.env.PORT, process.env.HOST, err => {
  if (err) throw err;
  const { address, port } = fastify.server.address();
  console.log(`server listening on ${address}:${port}`);
});
