import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMfeComponent } from './user-mfe.component';

describe('UserMfeComponent', () => {
  let component: UserMfeComponent;
  let fixture: ComponentFixture<UserMfeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMfeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
