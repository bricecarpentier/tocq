const status = ({ logs }) => async () => {
  const current = await logs.head('default');
  return { status: 'OK', current };
};


module.exports = status;
