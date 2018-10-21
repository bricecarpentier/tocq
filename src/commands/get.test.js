const levelErrors = require('level-errors');
const get = require('./get');

const DEFAULT_EVENT = {
  type: 'ACTION_TYPE',
  payload: {
    message: 'cool story',
  },
};

const getLogs = get => ({ get });


test('when called on an existing sequence id', async () => {
  expect.assertions(2);
  const mockGet = jest.fn().mockResolvedValue(DEFAULT_EVENT);
  const logs = getLogs(mockGet);
  const uut = get({ logs });
  const response = await uut({ params: { sequenceId: 2 }});
  expect(response).toEqual({
    ...DEFAULT_EVENT,
    sequenceId: 2,
  });
  expect(mockGet).toHaveBeenCalledWith('default', 2);
});


test('when called on an inexisting sequence id', async () => {
  expect.assertions(4);
  const mockGet = jest.fn().mockRejectedValue(new levelErrors.NotFoundError());
  const logs = getLogs(mockGet);
  const uut = get({ logs });
  const params = { sequenceId: 2 };
  const response = await uut({ params: { sequenceId: 2 }}).catch(e => e);
  expect(response).toBeInstanceOf(Error);
  expect(response.notFound).toBe(true);
  expect(response.status).toBe(404);
  expect(mockGet).toHaveBeenCalledWith('default', 2);
});
