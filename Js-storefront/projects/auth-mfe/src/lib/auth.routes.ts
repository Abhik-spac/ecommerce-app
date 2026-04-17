import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { OTPLoginComponent } from './otp-login/otp-login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'otp-login',
    component: OTPLoginComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  }
];
