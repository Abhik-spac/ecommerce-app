import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '@ecommerce/shared';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="profile-container">
      <h1>My Profile</h1>

      <mat-tab-group>
        <!-- Personal Information Tab -->
        <mat-tab label="Personal Information">
          <mat-card>
            <mat-card-content>
              <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
                <div class="form-section">
                  <h3>Basic Information</h3>
                  
                  <div class="form-row">
                    <mat-form-field appearance="outline">
                      <mat-label>First Name</mat-label>
                      <input matInput formControlName="firstName" required>
                      <mat-icon matPrefix>person</mat-icon>
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                      <mat-label>Last Name</mat-label>
                      <input matInput formControlName="lastName" required>
                    </mat-form-field>
                  </div>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Email</mat-label>
                    <input matInput type="email" formControlName="email" required>
                    <mat-icon matPrefix>email</mat-icon>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Phone Number</mat-label>
                    <input matInput type="tel" formControlName="phone">
                    <mat-icon matPrefix>phone</mat-icon>
                  </mat-form-field>
                </div>

                <div class="form-actions">
                  <button mat-raised-button color="primary" type="submit"
                          [disabled]="!profileForm.valid || isSaving()">
                    {{ isSaving() ? 'Saving...' : 'Save Changes' }}
                  </button>
                </div>
              </form>
            </mat-card-content>
          </mat-card>
        </mat-tab>

        <!-- Change Password Tab -->
        <mat-tab label="Change Password">
          <mat-card>
            <mat-card-content>
              <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
                <div class="form-section">
                  <h3>Change Password</h3>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Current Password</mat-label>
                    <input matInput [type]="hideCurrentPassword() ? 'password' : 'text'"
                           formControlName="currentPassword" required>
                    <mat-icon matPrefix>lock</mat-icon>
                    <button mat-icon-button matSuffix type="button"
                            (click)="hideCurrentPassword.set(!hideCurrentPassword())">
                      <mat-icon>{{ hideCurrentPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                    </button>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>New Password</mat-label>
                    <input matInput [type]="hideNewPassword() ? 'password' : 'text'"
                           formControlName="newPassword" required>
                    <mat-icon matPrefix>lock</mat-icon>
                    <button mat-icon-button matSuffix type="button"
                            (click)="hideNewPassword.set(!hideNewPassword())">
                      <mat-icon>{{ hideNewPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                    </button>
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Confirm New Password</mat-label>
                    <input matInput [type]="hideConfirmPassword() ? 'password' : 'text'"
                           formControlName="confirmPassword" required>
                    <mat-icon matPrefix>lock</mat-icon>
                    <button mat-icon-button matSuffix type="button"
                            (click)="hideConfirmPassword.set(!hideConfirmPassword())">
                      <mat-icon>{{ hideConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                    </button>
                  </mat-form-field>

                  <div *ngIf="passwordForm.hasError('passwordMismatch') && 
                              passwordForm.get('confirmPassword')?.touched"
                       class="error-message">
                    Passwords do not match
                  </div>
                </div>

                <div class="form-actions">
                  <button mat-raised-button color="primary" type="submit"
                          [disabled]="!passwordForm.valid || isSaving()">
                    {{ isSaving() ? 'Updating...' : 'Update Password' }}
                  </button>
                </div>
              </form>
            </mat-card-content>
          </mat-card>
        </mat-tab>

        <!-- Saved Addresses Tab -->
        <mat-tab label="Saved Addresses">
          <mat-card>
            <mat-card-content>
              <div class="addresses-section">
                <div class="section-header">
                  <h3>Saved Addresses</h3>
                  <button mat-raised-button color="primary" (click)="addNewAddress()">
                    <mat-icon>add</mat-icon>
                    Add New Address
                  </button>
                </div>

                <div *ngIf="savedAddresses().length === 0" class="empty-state">
                  <mat-icon>location_off</mat-icon>
                  <p>No saved addresses yet</p>
                </div>

                <div class="addresses-grid">
                  <mat-card *ngFor="let address of savedAddresses()" class="address-card">
                    <mat-card-content>
                      <div class="address-header">
                        <h4>{{ address.label }}</h4>
                        <div class="address-actions">
                          <button mat-icon-button (click)="editAddress(address)">
                            <mat-icon>edit</mat-icon>
                          </button>
                          <button mat-icon-button color="warn" (click)="deleteAddress(address.id)">
                            <mat-icon>delete</mat-icon>
                          </button>
                        </div>
                      </div>
                      <p>{{ address.firstName }} {{ address.lastName }}</p>
                      <p>{{ address.address1 }}</p>
                      <p *ngIf="address.address2">{{ address.address2 }}</p>
                      <p>{{ address.city }}, {{ address.state }} {{ address.postalCode }}</p>
                      <p>{{ address.country }}</p>
                      <p>Phone: {{ address.phone }}</p>
                    </mat-card-content>
                  </mat-card>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-tab>

        <!-- Account Settings Tab -->
        <mat-tab label="Account Settings">
          <mat-card>
            <mat-card-content>
              <div class="settings-section">
                <h3>Account Information</h3>
                <div class="info-row">
                  <span class="label">Account ID:</span>
                  <span class="value">{{ currentUser()?.id }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Member Since:</span>
                  <span class="value">{{ getCurrentDate() | date:'longDate' }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Account Type:</span>
                  <span class="value">{{ currentUser()?.role }}</span>
                </div>

                <mat-divider></mat-divider>

                <h3>Preferences</h3>
                <div class="preferences">
                  <div class="preference-item">
                    <mat-icon>notifications</mat-icon>
                    <div class="preference-content">
                      <h4>Email Notifications</h4>
                      <p>Receive updates about your orders and offers</p>
                    </div>
                    <button mat-button color="primary">Manage</button>
                  </div>

                  <div class="preference-item">
                    <mat-icon>language</mat-icon>
                    <div class="preference-content">
                      <h4>Language</h4>
                      <p>English (US)</p>
                    </div>
                    <button mat-button color="primary">Change</button>
                  </div>

                  <div class="preference-item">
                    <mat-icon>currency_rupee</mat-icon>
                    <div class="preference-content">
                      <h4>Currency</h4>
                      <p>INR (₹)</p>
                    </div>
                    <button mat-button color="primary">Change</button>
                  </div>
                </div>

                <mat-divider></mat-divider>

                <h3>Danger Zone</h3>
                <div class="danger-zone">
                  <button mat-stroked-button color="warn" (click)="deactivateAccount()">
                    <mat-icon>block</mat-icon>
                    Deactivate Account
                  </button>
                  <button mat-stroked-button color="warn" (click)="deleteAccount()">
                    <mat-icon>delete_forever</mat-icon>
                    Delete Account
                  </button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;

      h1 {
        margin: 0 0 24px 0;
        font-size: 32px;
        font-weight: 500;
      }
    }

    mat-card {
      margin-top: 24px;

      mat-card-content {
        padding: 24px;
      }
    }

    .form-section {
      margin-bottom: 24px;

      h3 {
        margin: 0 0 24px 0;
        font-size: 20px;
        font-weight: 500;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .full-width {
      width: 100%;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 24px;
    }

    .error-message {
      color: #f44336;
      font-size: 14px;
      margin-top: -16px;
      margin-bottom: 16px;
    }

    .addresses-section {
      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;

        h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 500;
        }
      }

      .empty-state {
        text-align: center;
        padding: 48px 24px;

        mat-icon {
          font-size: 64px;
          width: 64px;
          height: 64px;
          color: #ccc;
          margin-bottom: 16px;
        }

        p {
          color: #999;
          font-size: 16px;
        }
      }

      .addresses-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;

        .address-card {
          mat-card-content {
            padding: 16px;

            .address-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 12px;

              h4 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
              }

              .address-actions {
                display: flex;
                gap: 4px;
              }
            }

            p {
              margin: 4px 0;
              color: #666;
              font-size: 14px;
            }
          }
        }
      }
    }

    .settings-section {
      h3 {
        margin: 24px 0 16px 0;
        font-size: 20px;
        font-weight: 500;

        &:first-child {
          margin-top: 0;
        }
      }

      .info-row {
        display: flex;
        justify-content: space-between;
        padding: 12px 0;
        border-bottom: 1px solid #f0f0f0;

        .label {
          color: #666;
          font-weight: 500;
        }

        .value {
          color: #333;
        }
      }

      .preferences {
        .preference-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid #f0f0f0;

          &:last-child {
            border-bottom: none;
          }

          mat-icon {
            color: #666;
          }

          .preference-content {
            flex: 1;

            h4 {
              margin: 0 0 4px 0;
              font-size: 16px;
              font-weight: 500;
            }

            p {
              margin: 0;
              color: #666;
              font-size: 14px;
            }
          }
        }
      }

      .danger-zone {
        display: flex;
        gap: 16px;
        margin-top: 16px;

        button {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      }
    }

    mat-divider {
      margin: 24px 0;
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  
  hideCurrentPassword = signal(true);
  hideNewPassword = signal(true);
  hideConfirmPassword = signal(true);
  isSaving = signal(false);
  savedAddresses = signal<any[]>([]);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || ''
      });
    }

    this.loadSavedAddresses();
  }

  currentUser() {
    return this.authService.currentUser();
  }

  getCurrentDate() {
    return new Date();
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.isSaving.set(true);
      
      // Simulate API call
      setTimeout(() => {
        this.isSaving.set(false);
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
      }, 1000);
    }
  }

  changePassword(): void {
    if (this.passwordForm.valid) {
      this.isSaving.set(true);
      
      // Simulate API call
      setTimeout(() => {
        this.isSaving.set(false);
        this.passwordForm.reset();
        this.snackBar.open('Password changed successfully!', 'Close', { duration: 3000 });
      }, 1000);
    }
  }

  loadSavedAddresses(): void {
    // Load from localStorage or API
    const saved = localStorage.getItem('savedAddresses');
    if (saved) {
      this.savedAddresses.set(JSON.parse(saved));
    }
  }

  addNewAddress(): void {
    this.snackBar.open('Add address feature coming soon!', 'Close', { duration: 3000 });
  }

  editAddress(address: any): void {
    this.snackBar.open('Edit address feature coming soon!', 'Close', { duration: 3000 });
  }

  deleteAddress(addressId: string): void {
    if (confirm('Are you sure you want to delete this address?')) {
      this.savedAddresses.update(addresses => 
        addresses.filter(addr => addr.id !== addressId)
      );
      localStorage.setItem('savedAddresses', JSON.stringify(this.savedAddresses()));
      this.snackBar.open('Address deleted successfully!', 'Close', { duration: 3000 });
    }
  }

  deactivateAccount(): void {
    if (confirm('Are you sure you want to deactivate your account?')) {
      this.snackBar.open('Account deactivation feature coming soon!', 'Close', { duration: 3000 });
    }
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      this.snackBar.open('Account deletion feature coming soon!', 'Close', { duration: 3000 });
    }
  }
}

// Made with Bob
