const subscribe = client => {
  console.log(client.req.headers['last-event-id']);
  client.send('Hi there!');
};


module.exports = subscribe;
