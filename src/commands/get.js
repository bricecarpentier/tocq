const get = ({ logs }) => async (request, reply) => {
  const { sequenceId } = request.params;
  const event = await logs.get('default', sequenceId);
  console.log(event);
  reply.send({
    ...event,
    sequenceId,
  });
};


module.exports = get;
