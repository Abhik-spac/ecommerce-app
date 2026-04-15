import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthMfeComponent } from './auth-mfe.component';

describe('AuthMfeComponent', () => {
  let component: AuthMfeComponent;
  let fixture: ComponentFixture<AuthMfeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthMfeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthMfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
