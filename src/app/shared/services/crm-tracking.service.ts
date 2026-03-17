import { Injectable, OnDestroy, inject, NgZone } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { environment } from '../../../environments/environment';

interface TrackingEvent {
  source: string;
  eventType: 'open' | 'scroll' | 'time' | 'cta-click' | 'custom';
  metadata?: Record<string, unknown>;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class CrmTrackingService implements OnDestroy {
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private queue: TrackingEvent[] = [];
  private batchTimer: ReturnType<typeof setInterval> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private lastScrollThreshold = 0;
  private hasOpenFired = false;
  private isInitialized = false;
  private isEndpointAvailable = true;
  private failureCount = 0;
  private readonly MAX_FAILURES = 3;

  private readonly endpoint = environment.crmTracking?.trackingEndpoint ?? '';
  private readonly leadId = environment.crmTracking?.leadId ?? '';

  initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') return;
    if (!this.endpoint || !this.leadId) return;
    this.isInitialized = true;

    try {
      // 1. Open event
      if (!this.hasOpenFired) {
        this.enqueue('open');
        this.hasOpenFired = true;
      }

      // 2. Navigation tracking — run outside Angular zone to prevent change detection
      this.ngZone.runOutsideAngular(() => {
        this.router.events.pipe(
          filter((e): e is NavigationEnd => e instanceof NavigationEnd)
        ).subscribe(event => {
          try {
            if (!event.url.startsWith('/admin')) {
              this.enqueue('custom', {
                customEventName: 'page-view',
                customEventData: { route: event.urlAfterRedirects }
              });
              this.lastScrollThreshold = 0;
            }
          } catch { /* silently ignore */ }
        });

        // 3. Scroll tracking
        window.addEventListener('scroll', this.onScroll, { passive: true });

        // 4. Heartbeat
        this.startHeartbeat();
        document.addEventListener('visibilitychange', this.onVisibilityChange);

        // 5. Batch timer
        this.batchTimer = setInterval(() => this.flush(), 10000);

        // 6. Flush on close
        window.addEventListener('beforeunload', this.onBeforeUnload);
      });
    } catch {
      // If initialization fails, just disable tracking silently
      this.isEndpointAvailable = false;
    }
  }

  trackCTA(label: string): void {
    try {
      this.enqueue('cta-click', { label });
    } catch { /* silently ignore */ }
  }

  trackCustom(eventName: string, data?: Record<string, unknown>): void {
    try {
      const truncatedName = eventName.substring(0, 100);
      this.enqueue('custom', {
        customEventName: truncatedName,
        customEventData: data
      });
    } catch { /* silently ignore */ }
  }

  private enqueue(eventType: TrackingEvent['eventType'], metadata?: Record<string, unknown>): void {
    if (!this.isEndpointAvailable) return;
    this.queue.push({
      source: 'landing',
      eventType,
      metadata,
      timestamp: new Date().toISOString()
    });
  }

  private flush(): void {
    if (this.queue.length === 0 || !this.isEndpointAvailable) return;

    const events = [...this.queue];
    this.queue = [];

    const payload = JSON.stringify({
      leadId: this.leadId,
      events
    });

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        const sent = navigator.sendBeacon(this.endpoint, blob);
        if (!sent) {
          this.handleFlushFailure();
        }
      } else {
        fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true
        }).catch(() => {
          this.handleFlushFailure();
        });
      }
    } catch {
      this.handleFlushFailure();
    }
  }

  private handleFlushFailure(): void {
    this.failureCount++;
    if (this.failureCount >= this.MAX_FAILURES) {
      this.isEndpointAvailable = false;
      this.cleanup();
    }
  }

  private onScroll = (): void => {
    try {
      if (typeof document === 'undefined' || !this.isEndpointAvailable) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const diff = docHeight - windowHeight;
      if (diff <= 0) return;
      const scrollPercent = Math.round((scrollTop / diff) * 100);

      const threshold = Math.floor(scrollPercent / 10) * 10;
      if (threshold > this.lastScrollThreshold && threshold >= 10) {
        for (let t = this.lastScrollThreshold + 10; t <= threshold; t += 10) {
          this.enqueue('scroll', { percent: t });
        }
        this.lastScrollThreshold = threshold;
      }
    } catch { /* silently ignore */ }
  };

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      try {
        if (document.visibilityState === 'visible') {
          this.enqueue('time', { duration: 30 });
        }
      } catch { /* silently ignore */ }
    }, 30000);
  }

  private onVisibilityChange = (): void => {
    try {
      if (document.hidden) {
        this.flush();
      }
    } catch { /* silently ignore */ }
  };

  private onBeforeUnload = (): void => {
    try {
      this.flush();
    } catch { /* silently ignore */ }
  };

  private cleanup(): void {
    if (this.batchTimer) { clearInterval(this.batchTimer); this.batchTimer = null; }
    if (this.heartbeatTimer) { clearInterval(this.heartbeatTimer); this.heartbeatTimer = null; }
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('beforeunload', this.onBeforeUnload);
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }
    this.queue = [];
  }

  ngOnDestroy(): void {
    this.cleanup();
  }
}
