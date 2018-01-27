import { EventEmitter } from "events";

import { TocqEvent } from './tocq-event';

const NEW_EVENT: string = 'tocq:new_event';

export { NEW_EVENT };

export interface Datastore extends EventEmitter {
  fetch(from: number, limit?: number): Promise<Array<TocqEvent>>;
  append(type: string, payload:any): Promise<TocqEvent>;
}
