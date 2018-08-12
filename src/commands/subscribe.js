const onData = client => ({ seq, value }) =>
  client.send(JSON.stringify({ ...value, sequenceId: seq }))


const subscribe = ({ logs }) => client => {
  const lastSequenceId = client.req.headers['last-event-id'] || 0;
  const rs = logs.createReadStream('default', { since: lastSequenceId });
  rs.on('data', onData(client));
};


module.exports = subscribe;
