const append = (request, reply) =>
  reply.send({ command: 'append', status: 'OK' });


module.exports = append;
