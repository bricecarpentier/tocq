const append = require('./append');


describe('append', async () => {
  const logs = {
    append: jest.fn().mockResolvedValue(42),
  }
  const uut = append({ logs });


  test('when called with an FSA', async () => {
    expect.assertions(2);
    const body = {
      type: 'ACTION_TYPE',
      payload: {
        message: 'so far so good',
      },
    };
    const request = { body };
    const reply = { code: jest.fn() };

    const response = await uut(request, reply);
    expect(response).toEqual({ ...body, sequenceId: 42 });
    expect(reply.code).not.toHaveBeenCalled();
  });


  test('when called with something else than an FSA', async () => {
    expect.assertions(2);
    const body = {
      foo: 'bar',
    };
    const request = { body };
    const reply = { code: jest.fn() };
    const response = await uut(request, reply);
  expect(response).toEqual({ message: 'request.body should be a FSA' });
  expect(reply.code).toHaveBeenCalledWith(400);
  });
});
