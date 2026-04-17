import { Component, ViewEncapsulation, HostListener } from '@angular/core';
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
export class HomeComponent {
  gridCols = 4;

  categories = [
    { id: 'electronics', name: 'Electronics', icon: 'devices' },
    { id: 'fashion', name: 'Fashion', icon: 'checkroom' },
    { id: 'home', name: 'Home & Garden', icon: 'home' },
    { id: 'sports', name: 'Sports', icon: 'sports_soccer' }
  ];

  constructor() {
    this.updateGridCols(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateGridCols(event.target.innerWidth);
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
