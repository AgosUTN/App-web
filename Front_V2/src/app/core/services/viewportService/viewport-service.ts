import { Injectable } from '@angular/core';
import { fromEvent, Observable, Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ViewportService {
  readonly MOBILE_BREAKPOINT: number = 768;

  private isMobile: boolean = window.innerWidth < this.MOBILE_BREAKPOINT;
  private mobileSubject = new Subject<boolean>();

  constructor() {
    fromEvent(window, 'resize').subscribe(() => {
      this.onResize(); // Al usar esto y no hostlistener (que solo lo pueden usar componentes), habrá que forzar el change detections en los componentes.
    });
  }
  private onResize(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < this.MOBILE_BREAKPOINT;

    if (this.isMobile && !wasMobile) {
      // Desktop a mobile
      this.mobileSubject.next(true);
      console.log('Se paso a mobile');
    } else if (wasMobile && !this.isMobile) {
      // Mobile a desktop
      this.mobileSubject.next(false);
      console.log('Se paso a Desktop');
    }
  }

  getMobileTracker(): Observable<boolean> {
    return this.mobileSubject.asObservable();
  }
}
