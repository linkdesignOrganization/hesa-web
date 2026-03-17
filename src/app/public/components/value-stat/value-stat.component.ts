import { Component, input, ElementRef, inject, AfterViewInit, signal, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-value-stat',
  standalone: true,
  templateUrl: './value-stat.component.html',
  styleUrl: './value-stat.component.scss'
})
export class ValueStatComponent implements AfterViewInit, OnDestroy {
  number = input('0');
  suffix = input('');
  label = input('');

  displayValue = signal('0');
  counted = signal(false);

  private el = inject(ElementRef);
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !this.counted()) {
          this.animateCountUp();
          this.observer?.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private animateCountUp(): void {
    const target = parseInt(this.number(), 10);
    if (isNaN(target)) {
      this.displayValue.set(this.number());
      this.counted.set(true);
      return;
    }

    const duration = 1500;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      this.displayValue.set(String(current));

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.displayValue.set(String(target));
        this.counted.set(true);
      }
    };

    requestAnimationFrame(step);
  }
}
