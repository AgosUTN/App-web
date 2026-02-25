import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { InvalidateCacheData, SOCKET_EVENTS } from '../../constants/socketEvents.config.';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket = io('http://localhost:3000');

  // Observables que emiten los eventos informados por la API

  private cacheInvalidateSubject = new Subject<InvalidateCacheData>();

  constructor() {
    this.socket.on(SOCKET_EVENTS.CACHE_INVALIDATE, (data: InvalidateCacheData) => {
      this.cacheInvalidateSubject.next(data);
    });
  }

  getCacheInvalidateTracker(): Observable<InvalidateCacheData> {
    return this.cacheInvalidateSubject.asObservable();
  }
}
