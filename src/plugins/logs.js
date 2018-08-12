const fp = require('fastify-plugin');
const levelLogs = require('level-logs');

const logPlugin = (fastify, opts, next) => {
  const logs = levelLogs(fastify.level, opts);
  
  fastify.decorate('logs', logs);

  next();
};


module.exports = fp(logPlugin, {
  fastify: '>=1.0.0',
  name: 'level-logs',
  dependencies: ['fastify-leveldb'],
});
