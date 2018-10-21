const status = require('./status');


const getLogs = head => ({ head });


test('when the log already exists', async () => {
  const mockHead = jest.fn().mockResolvedValue(42);
  const logs = getLogs(mockHead);
  const uut = status({ logs });
  const response = await uut();
  expect(response).toEqual({ status: 'OK', current: 42 });
});


test('when the log does not exist yet', async () => {
  const mockHead = jest.fn().mockResolvedValue(0);
  const logs = getLogs(mockHead);
  const uut = status({ logs });
  const response = await uut();
  expect(response).toEqual({ status: 'OK', current: 0 });
});
