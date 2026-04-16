import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { provideRouter, RouterOutlet } from '@angular/router';
import { AUTH_ROUTES } from './lib/auth.routes';

@Component({
  selector: 'auth-root',
  standalone: true,
  template: '<router-outlet></router-outlet>',
  imports: [RouterOutlet]
})
export class AuthAppComponent {}

bootstrapApplication(AuthAppComponent, {
  providers: [
    provideRouter(AUTH_ROUTES)
  ]
}).catch(err => console.error(err));

// Made with Bob
