const EventEmitter = require('events');
const subscribe = require('./subscribe');


const getLogs = createReadStream => ({ createReadStream });


const createEvent = message => ({
  type: 'ACTION_TYPE',
  payload: {
    message,
  },
});


const setupMocks = lastEventId => {
  const send = jest.fn();
  const client = {
    req: {
      headers: {
        'last-event-id': lastEventId,
      },
    },
    send,
  };

  const rs = new EventEmitter();
  const createReadStream = jest.fn().mockReturnValue(rs);

  return {
    client,
    createReadStream,
    rs,
  };
}


it('creates a read stream and subscribes to it', () => {
  
  const { client, createReadStream, rs } = setupMocks(42);
  const logs = getLogs(createReadStream);
  const uut = subscribe({ logs });

  uut(client);

  expect(createReadStream).toHaveBeenCalledWith('default', { since: 42 });
  rs.emit('data', { value: createEvent('one'), seq: 43 });
  rs.emit('data', { value: createEvent('two'), seq: 44 });

  expect(client.send).toHaveBeenCalledTimes(2);
  const [call1, call2] = client.send.mock.calls;
  expect(JSON.parse(call1[0])).toEqual({ ...createEvent('one'), sequenceId: 43 });
  expect(JSON.parse(call2[0])).toEqual({ ...createEvent('two'), sequenceId: 44 });
});


it('initialises the read stream at 0 if no last event id is provided', () => {
  const { client, createReadStream, rs } = setupMocks(undefined);
  const logs = getLogs(createReadStream);
  const uut = subscribe({ logs });

  uut(client);

  expect(createReadStream).toHaveBeenCalledWith('default', { since: 0 });
  rs.emit('data', { value: createEvent('one'), seq: 1 });

  expect(client.send).toHaveBeenCalledTimes(1);
  const [call1] = client.send.mock.calls;
  expect(JSON.parse(call1[0])).toEqual({ ...createEvent('one'), sequenceId: 1 });
  
});
