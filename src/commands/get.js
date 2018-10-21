const get = ({ logs }) => async (request) => {
  const { sequenceId } = request.params;
  const event = await logs.get('default', sequenceId);
  return {
    ...event,
    sequenceId,
  };
};


module.exports = get;
