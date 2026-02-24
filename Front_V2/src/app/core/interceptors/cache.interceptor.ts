import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { CacheService } from '../services/cacheService/cache-service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cacheService: CacheService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') {
      return next.handle(req);
    }
    const cachedResponse = this.cacheService.getData(req.urlWithParams);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    return next.handle(req).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.cacheService.setData(req.urlWithParams, event);
        }
      }),
    );
  }
}
