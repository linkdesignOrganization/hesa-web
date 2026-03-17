import { Injectable, OnDestroy, inject } from '@angular/core';
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
  private queue: TrackingEvent[] = [];
  private batchTimer: ReturnType<typeof setInterval> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private lastScrollThreshold = 0;
  private hasOpenFired = false;
  private isInitialized = false;

  private readonly endpoint = environment.crmTracking.trackingEndpoint;
  private readonly leadId = environment.crmTracking.leadId;

  initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // 1. Open event
    if (!this.hasOpenFired) {
      this.enqueue('open');
      this.hasOpenFired = true;
    }

    // 2. Navigation tracking
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe(event => {
      if (!event.url.startsWith('/admin')) {
        this.enqueue('custom', {
          customEventName: 'page-view',
          customEventData: { route: event.urlAfterRedirects }
        });
        this.lastScrollThreshold = 0;
      }
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
  }

  trackCTA(label: string): void {
    this.enqueue('cta-click', { label });
  }

  trackCustom(eventName: string, data?: Record<string, unknown>): void {
    const truncatedName = eventName.substring(0, 100);
    this.enqueue('custom', {
      customEventName: truncatedName,
      customEventData: data
    });
  }

  private enqueue(eventType: TrackingEvent['eventType'], metadata?: Record<string, unknown>): void {
    this.queue.push({
      source: 'landing',
      eventType,
      metadata,
      timestamp: new Date().toISOString()
    });
  }

  private flush(): void {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    const payload = JSON.stringify({
      leadId: this.leadId,
      events
    });

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(this.endpoint, blob);
      } else {
        fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true
        }).catch(err => console.warn('CRM tracking fetch error:', err));
      }
    } catch (err) {
      console.warn('CRM tracking error:', err);
    }
  }

  private onScroll = (): void => {
    if (typeof document === 'undefined') return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    const scrollPercent = Math.round((scrollTop / (docHeight - windowHeight)) * 100);

    const threshold = Math.floor(scrollPercent / 10) * 10;
    if (threshold > this.lastScrollThreshold && threshold >= 10) {
      for (let t = this.lastScrollThreshold + 10; t <= threshold; t += 10) {
        this.enqueue('scroll', { percent: t });
      }
      this.lastScrollThreshold = threshold;
    }
  };

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        this.enqueue('time', { duration: 30 });
      }
    }, 30000);
  }

  private onVisibilityChange = (): void => {
    if (document.hidden) {
      this.flush();
    }
  };

  private onBeforeUnload = (): void => {
    this.flush();
  };

  ngOnDestroy(): void {
    if (this.batchTimer) clearInterval(this.batchTimer);
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('beforeunload', this.onBeforeUnload);
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }
    this.flush();
  }
}
