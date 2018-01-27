'use strict'
import { Promise } from 'bluebird';
import { EventEmitter } from "events";
import {
  TocqEvent,
  Datastore,
  NEW_EVENT,
} from "../core/index";

interface StoredTocqEvent {
  createdAt: number
  type: string
  payload: any
}

const toEvent = (data: StoredTocqEvent, id: number) => ({ ...data, id });

/*
 * Warning: this is only meant as a PoC.
 * Please do not use InMemoryDatastore in anything even remotely close to
 * production unless you are damn sure that you know what you're doing
 */

export default class InMemoryDatastore extends EventEmitter implements Datastore {
  limit: number;
  store: Array<StoredTocqEvent>;

  constructor(limit = 100) {
    super()
    this.limit = limit;
    this.store = [];
  }

  notify(event: TocqEvent) {
    this.emit(NEW_EVENT, event);
  }

  fetch(from: number, limit = this.limit) {
    return this.store
      .slice(from, from + limit)
      .map(toEvent);
  }

  async append(type, payload) {
    const event: StoredTocqEvent = { type, payload, createdAt: Date.now() };
    this.store.push(event);
    const returnedEvent: TocqEvent = toEvent(event, this.store.length - 1);
    Promise.delay(0).then(() => this.notify(returnedEvent));
    return returnedEvent;
  }
}
