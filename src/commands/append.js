const { isFSA } = require('flux-standard-action');


const append = ({ logs }) => async (request, reply) => {
  const { body } = request;
  if (!isFSA(body)) {
    reply.code(400);
    return { message: 'request.body should be a FSA' };
  }
  
  const sequenceId = await logs.append('default', body);
  return { ...body, sequenceId };
}


module.exports = append;
