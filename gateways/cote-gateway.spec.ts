const lolex = require('lolex');

import { Subscriber } from 'cote';
import { NEW_EVENT } from '../core/datastore';
import CoteGateway from './cote-gateway';
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
