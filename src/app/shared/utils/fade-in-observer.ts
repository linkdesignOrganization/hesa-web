import { ElementRef } from '@angular/core';

/**
 * Creates an IntersectionObserver that adds 'is-visible' class to elements
 * with the '.fade-in-section' selector when they enter the viewport.
 * Each element is unobserved after becoming visible.
 *
 * Usage:
 *   private fadeObserver: IntersectionObserver | null = null;
 *   ngAfterViewInit() { this.fadeObserver = initFadeInObserver(this.el); }
 *   ngOnDestroy() { this.fadeObserver?.disconnect(); }
 */
export function initFadeInObserver(
  el: ElementRef,
  options?: { threshold?: number; rootMargin?: string; delay?: number }
): IntersectionObserver | null {
  if (typeof window === 'undefined') return null;

  const { threshold = 0.15, rootMargin = '0px 0px -50px 0px' } = options || {};

  const elements = el.nativeElement.querySelectorAll('.fade-in-section');
  if (!elements.length) return null;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold, rootMargin }
  );

  elements.forEach((element: Element) => observer.observe(element));

  return observer;
}
