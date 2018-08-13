const status = ({ logs }) => async (request, reply) => {
  const current = await logs.head('default');
  return { status: 'OK', current };
};


module.exports = status;
