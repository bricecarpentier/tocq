const fp = require('fastify-plugin');
const SSE = require('sse');


const fastifySSE = (fastify, opts, next) => {
  const {
    handle,
    ...otherOptions
  } = opts;

  if (typeof handle !== 'function') {
    return next(new Error('invalid handle function'));
  }

  const sse = new SSE(fastify.server, otherOptions);
  sse.on('connection', handle);

  fastify.decorate('sse', sse);

  next();
};


module.exports = fp(fastifySSE, {
  fastify: '>=1.0.0',
  name: 'fastify-sse',
});
