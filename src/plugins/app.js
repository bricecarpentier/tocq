const { promisify } = require('util');
const sse = require('./sse');
const fp = require('fastify-plugin');


const promisifyLogs = logs => ({
  append: promisify(logs.append).bind(logs),
  createReadStream: logs.createReadStream.bind(logs),
  get: promisify(logs.get).bind(logs),
  head: promisify(logs.head).bind(logs),
});


const app = (fastify, opts, next) => {
  const { commands } = opts;

  const logs = promisifyLogs(fastify.logs);

  fastify.register(sse, {
    path: '/subscribe',
    handle: commands.subscribe({ logs }),
  });

  fastify.get('/status', commands.status({ logs }));
  fastify.post('/events/', commands.append({ logs }));
  fastify.get('/events/:sequenceId', commands.get({ logs }));

  next();
};


module.exports = fp(app, {
  fastify: '>=1.0.0',
  name: 'tocq',
  dependencies: ['level-logs'],
});
