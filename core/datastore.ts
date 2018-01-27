import { EventEmitter } from "events";

import { TocqEvent } from './tocq-event';

export interface Datastore extends EventEmitter {
  fetch(from: number, limit?: number): Array<TocqEvent>;
  append(type: string, payload:any): Promise<TocqEvent>;
}
