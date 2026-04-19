import { Injectable, signal, computed } from '@angular/core';

/**
 * Responsive Service
 * Provides reactive breakpoint detection for all MFEs
 * Uses global SCSS breakpoint variables
 */
@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  // Breakpoints matching _variables.scss
  private readonly BREAKPOINTS = {
    xs: 480,   // Extra small devices (phones)
    sm: 576,   // Small devices (phones)
    md: 768,   // Medium devices (tablets)
    lg: 992,   // Large devices (desktops)
    xl: 1200,  // Extra large devices (large desktops)
    xxl: 1400  // Extra extra large devices
  };

  // Current window width signal
  private windowWidth = signal<number>(typeof window !== 'undefined' ? window.innerWidth : 0);

  // Computed breakpoint signals
  isXs = computed(() => this.windowWidth() < this.BREAKPOINTS.sm);
  isSm = computed(() => this.windowWidth() >= this.BREAKPOINTS.sm && this.windowWidth() < this.BREAKPOINTS.md);
  isMd = computed(() => this.windowWidth() >= this.BREAKPOINTS.md && this.windowWidth() < this.BREAKPOINTS.lg);
  isLg = computed(() => this.windowWidth() >= this.BREAKPOINTS.lg && this.windowWidth() < this.BREAKPOINTS.xl);
  isXl = computed(() => this.windowWidth() >= this.BREAKPOINTS.xl && this.windowWidth() < this.BREAKPOINTS.xxl);
  isXxl = computed(() => this.windowWidth() >= this.BREAKPOINTS.xxl);

  // Convenience computed properties
  isMobile = computed(() => this.windowWidth() < this.BREAKPOINTS.md); // < 768px
  isTablet = computed(() => this.windowWidth() >= this.BREAKPOINTS.md && this.windowWidth() < this.BREAKPOINTS.lg); // 768-991px
  isDesktop = computed(() => this.windowWidth() >= this.BREAKPOINTS.lg); // >= 992px

  // Specific breakpoint checks
  isSmallMobile = computed(() => this.windowWidth() < this.BREAKPOINTS.sm); // < 576px
  isLargeDesktop = computed(() => this.windowWidth() >= this.BREAKPOINTS.xl); // >= 1200px

  constructor() {
    if (typeof window !== 'undefined') {
      // Listen for window resize
      window.addEventListener('resize', () => {
        this.windowWidth.set(window.innerWidth);
      });

      // Listen for orientation change (mobile devices)
      window.addEventListener('orientationchange', () => {
        setTimeout(() => {
          this.windowWidth.set(window.innerWidth);
        }, 100);
      });
    }
  }

  /**
   * Get current window width
   */
  getWidth(): number {
    return this.windowWidth();
  }

  /**
   * Check if width is less than specified breakpoint
   */
  isLessThan(breakpoint: keyof typeof this.BREAKPOINTS): boolean {
    return this.windowWidth() < this.BREAKPOINTS[breakpoint];
  }

  /**
   * Check if width is greater than specified breakpoint
   */
  isGreaterThan(breakpoint: keyof typeof this.BREAKPOINTS): boolean {
    return this.windowWidth() >= this.BREAKPOINTS[breakpoint];
  }

  /**
   * Check if width is between two breakpoints
   */
  isBetween(min: keyof typeof this.BREAKPOINTS, max: keyof typeof this.BREAKPOINTS): boolean {
    return this.windowWidth() >= this.BREAKPOINTS[min] && this.windowWidth() < this.BREAKPOINTS[max];
  }

  /**
   * Get current breakpoint name
   */
  getCurrentBreakpoint(): string {
    const width = this.windowWidth();
    if (width < this.BREAKPOINTS.sm) return 'xs';
    if (width < this.BREAKPOINTS.md) return 'sm';
    if (width < this.BREAKPOINTS.lg) return 'md';
    if (width < this.BREAKPOINTS.xl) return 'lg';
    if (width < this.BREAKPOINTS.xxl) return 'xl';
    return 'xxl';
  }
}

// Made with Bob
