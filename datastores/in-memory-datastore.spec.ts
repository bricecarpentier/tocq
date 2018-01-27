const lolex = require('lolex');
import { NEW_EVENT } from '../core/datastore';
import InMemoryDatastore from './in-memory-datastore';

describe('append', () => {
  let clock;

  beforeEach(() => { clock = lolex.install(); });
  afterEach(() => { clock = clock.uninstall(); });
  
  it('should append to and fetch from the event store', async () => {
    let expected;
    const ds = new InMemoryDatastore();
    await ds.append('toto', { maman: 5 });
    expected = [{ id: 0, createdAt: 0, type: 'toto', payload: { maman: 5 }}];
    expect(await ds.fetch(0)).toEqual(expected);
    clock.tick(100);
    await ds.append('toto', { maman: 3 });
    expected = [
      { id: 0, createdAt: 0, type: 'toto', payload: { maman: 5 }},
      { id: 1, createdAt: 100, type: 'toto', payload: { maman: 3 }}
    ];
    expect(await ds.fetch(0)).toEqual(expected);
  });

  it ('should emit when an event is appended', async () => {
    const mock = jest.fn();
    const ds = new InMemoryDatastore();
    ds.addListener(NEW_EVENT, mock);
    await ds.append('toto', { maman: 5 });
    clock.tick(1);
    expect(mock).toHaveBeenCalled();
  });
})
