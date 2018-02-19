const lolex = require('lolex');

import { Requester, Subscriber } from 'cote';
import { NEW_EVENT } from '../core/datastore';
import CoteGateway, { FETCH } from './cote-gateway';
import InMemoryDatastore from '../datastores/in-memory-datastore';

describe('publishing', () => {
  let clock;
  beforeEach(() => { clock = lolex.install(); });
  afterEach(() => { clock = clock.uninstall(); });

  it('should send events', async () => {
    const ds = new InMemoryDatastore();
    const gateway = new CoteGateway(ds);
    const mock = jest.fn();
    gateway.publisher.publish = mock;
    await ds.append('toto', { maman: 5 });
    clock.tick();
    expect(mock).toHaveBeenCalledWith(NEW_EVENT, {
      id: 0,
      createdAt: 0,
      type: 'toto',
      payload: { maman: 5 },
    });

    gateway.teardown();
  });
});

describe('fetching', () => {
  let clock;
  beforeEach(() => { clock = lolex.install(); });
  afterEach(() => { clock = clock.uninstall(); });

  it('should return all events', async () => {
    const ds = new InMemoryDatastore();
    await ds.append('toto', { maman: 5 });
    await ds.append('titi', { papa: 'roger' });
    const gateway = new CoteGateway(ds);
    const requester = new Requester({ name: 'test', key: 'tocq' });

    const events = await requester.send({ type: FETCH, from: 0, limit: 100 });
    expect(events).toEqual([
      { id: 0, createdAt: 0, type: 'toto', payload: { maman: 5 } },
      { id: 1, createdAt: 0, type: 'titi', payload: { papa: 'roger' } },
    ]);
    clock.tick();

    requester.close();
    gateway.teardown();
  });

  it('should return a subset of events', async () => {
    const ds = new InMemoryDatastore();
    await ds.append('toto', { maman: 5 });
    await ds.append('titi', { papa: 'roger' });
    const gateway = new CoteGateway(ds);
    const requester = new Requester({ name: 'test', key: 'tocq' });

    const events1 = await requester.send({ type: FETCH, from: 0, limit: 1 });
    expect(events1).toEqual([
      { id: 0, createdAt: 0, type: 'toto', payload: { maman: 5 } },
    ]);
    clock.tick();

    const events2 = await requester.send({ type: FETCH, from: 1 });
    expect(events2).toEqual([
      { id: 1, createdAt: 0, type: 'titi', payload: { papa: 'roger' } },
    ]);
    clock.tick();

    requester.close();
    gateway.teardown();
  });
});
