import { bootstrapApplication } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { provideRouter, RouterOutlet } from '@angular/router';
import { USER_ROUTES } from './lib/user.routes';

@Component({
  selector: 'user-root',
  standalone: true,
  template: '<router-outlet></router-outlet>',
  imports: [RouterOutlet]
})
export class UserAppComponent {}

bootstrapApplication(UserAppComponent, {
  providers: [
    provideRouter(USER_ROUTES)
  ]
}).catch(err => console.error(err));

// Made with Bob
