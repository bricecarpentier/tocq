import { Publisher, Responder, Event as CoteEvent } from 'cote';

import { Datastore, NEW_EVENT } from '../core/datastore';
import { Gateway } from '../core/gateway';
import { TocqEvent } from '../core/tocq-event';

const FETCH:string = 'tocq:fetch';

interface CoteGatewayEvent extends CoteEvent {
  from: number,
  limit?: number,
}

export default class CoteGateway implements Gateway {
  datastore: Datastore;
  publisher: Publisher;
  responder: Responder;

  constructor(datastore: Datastore) {
    this.datastore = datastore;
    this.datastore.addListener(NEW_EVENT, this.onNewEvent);
    this.publisher = new Publisher({ name: 'tocq:publisher', key: 'tocq' });
    this.responder = new Responder({ name: 'tocq:responder', key: 'tocq' });
    this.responder.on(FETCH, this.onFetchRequest);
  }

  onNewEvent = (event: TocqEvent) => {
    this.publisher.publish(NEW_EVENT, event);
  }

  onFetchRequest = (event: CoteGatewayEvent): Promise<Array<TocqEvent>> => { 
    return this.datastore.fetch(event.from, event.limit);
  }

  teardown = () => {
    this.datastore.removeListener(NEW_EVENT, this.onNewEvent);
    this.publisher.close();
    this.responder.removeAllListeners();
    this.responder.close();
  }
}

export {
  FETCH,
};
