const append = require('./append');


const getLogs = () => ({
  append: jest.fn().mockResolvedValue(42),
});


const getReply = () => ({ code: jest.fn() });


test('when called with an FSA', async () => {
  expect.assertions(3);
  const body = {
    type: 'ACTION_TYPE',
    payload: {
      message: 'so far so good',
    },
  };
  const request = { body };
  const reply = getReply();
  const logs = getLogs();
  const uut = append({ logs });
  const response = await uut(request, reply);
  expect(logs.append).toHaveBeenLastCalledWith('default', body);
  expect(response).toEqual({ ...body, sequenceId: 42 });
  expect(reply.code).not.toHaveBeenCalled();
});


test('when called with something else than an FSA', async () => {
  expect.assertions(3);
  const body = {
    foo: 'bar',
  };
  const request = { body };
  const reply = getReply();
  const logs = getLogs();
  const uut = append({ logs });
  const response = await uut(request, reply);
  expect(logs.append).not.toHaveBeenCalled();
  expect(response).toEqual({ message: 'request.body should be a FSA' });
  expect(reply.code).toHaveBeenCalledWith(400);
});
