const { isFSA } = require('flux-standard-action');


const append = ({ logs }) => async (request, reply) => {
  const { body } = request;
  if (!isFSA(body)) {
    return reply.code(400).send({ message: 'request.body should be a FSA'});
  }
  
  const sequenceId = await logs.append('default', body);
  return reply.send({ ...body, sequenceId });
}


module.exports = append;
