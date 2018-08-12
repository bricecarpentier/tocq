const status = ({ logs }) => async (request, reply) => {
  const current = await logs.head('default');
  reply.send({ status: 'OK', current });
};


module.exports = status;
