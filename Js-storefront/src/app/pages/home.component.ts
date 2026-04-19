import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly slideIntervalMs = 5000;
  private autoSlideTimer?: ReturnType<typeof setInterval>;

  gridCols = 4;
  currentSlideIndex = 0;

  heroSlides = [
    {
      eyebrow: 'Premium Deals',
      title: 'Welcome to eCommerce Store',
      description: 'Discover amazing products at unbeatable prices',
      ctaLabel: 'Shop Now',
      ctaLink: '/products',
      accent: 'Curated collections refreshed daily',
      background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.96) 0%, rgba(123, 31, 162, 0.92) 45%, rgba(26, 26, 46, 0.92) 100%)'
    },
    {
      eyebrow: 'Tech Spotlight',
      title: 'Upgrade Your Everyday Essentials',
      description: 'Explore trending electronics, accessories, and smart devices with premium offers.',
      ctaLabel: 'Explore Electronics',
      ctaLink: '/products',
      accent: 'Top-rated gadgets and fast shipping',
      background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.88) 0%, rgba(103, 58, 183, 0.9) 50%, rgba(15, 15, 35, 0.94) 100%)'
    },
    {
      eyebrow: 'Style Edit',
      title: 'Fresh Fashion for Every Season',
      description: 'Shop standout looks, must-have accessories, and wardrobe upgrades for every occasion.',
      ctaLabel: 'Browse Fashion',
      ctaLink: '/products',
      accent: 'New arrivals dropping every week',
      background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.86) 0%, rgba(236, 64, 122, 0.88) 48%, rgba(26, 26, 46, 0.94) 100%)'
    }
  ];

  categories = [
    { id: 'electronics', name: 'Electronics', icon: 'devices' },
    { id: 'fashion', name: 'Fashion', icon: 'checkroom' },
    { id: 'home', name: 'Home & Garden', icon: 'home' },
    { id: 'sports', name: 'Sports', icon: 'sports_soccer' }
  ];

  get currentSlide() {
    return this.heroSlides[this.currentSlideIndex];
  }

  constructor() {
    this.updateGridCols(window.innerWidth);
  }

  ngOnInit(): void {
    this.startAutoSlide();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateGridCols(event.target.innerWidth);
  }

  nextSlide(): void {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.heroSlides.length;
    this.restartAutoSlide();
  }

  previousSlide(): void {
    this.currentSlideIndex =
      (this.currentSlideIndex - 1 + this.heroSlides.length) % this.heroSlides.length;
    this.restartAutoSlide();
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
    this.restartAutoSlide();
  }

  private startAutoSlide(): void {
    this.stopAutoSlide();
    this.autoSlideTimer = setInterval(() => {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.heroSlides.length;
    }, this.slideIntervalMs);
  }

  private stopAutoSlide(): void {
    if (this.autoSlideTimer) {
      clearInterval(this.autoSlideTimer);
      this.autoSlideTimer = undefined;
    }
  }

  private restartAutoSlide(): void {
    this.startAutoSlide();
  }

  private updateGridCols(width: number) {
    if (width < 600) {
      this.gridCols = 1; // Mobile: 1 column
    } else if (width < 960) {
      this.gridCols = 2; // Tablet: 2 columns
    } else {
      this.gridCols = 4; // Desktop: 4 columns
    }
  }

  features = [
    {
      icon: 'local_shipping',
      title: 'Free Shipping',
      description: 'On orders over $50'
    },
    {
      icon: 'verified_user',
      title: 'Secure Payment',
      description: '100% secure transactions'
    },
    {
      icon: 'support_agent',
      title: '24/7 Support',
      description: 'Dedicated customer service'
    },
    {
      icon: 'autorenew',
      title: 'Easy Returns',
      description: '30-day return policy'
    }
  ];
}

// Made with Bob
