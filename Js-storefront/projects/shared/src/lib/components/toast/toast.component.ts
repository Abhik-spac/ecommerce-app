import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface ToastData {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Component({
  selector: 'lib-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="toast-content">
      <mat-icon class="toast-icon">{{ getIcon() }}</mat-icon>
      <span class="toast-message">{{ data.message }}</span>
    </div>
  `,
  styles: [`
    .toast-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .toast-icon {
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
      flex-shrink: 0;
    }

    .toast-message {
      flex: 1;
      font-size: 1rem;
      font-weight: 500;
      line-height: 1.5;
    }
  `]
})
export class ToastComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: ToastData) {}

  getIcon(): string {
    const icons = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };
    return icons[this.data.type];
  }
}

// Made with Bob
