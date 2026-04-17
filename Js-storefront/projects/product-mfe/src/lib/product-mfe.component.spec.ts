import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductMfeComponent } from './product-mfe.component';

describe('ProductMfeComponent', () => {
  let component: ProductMfeComponent;
  let fixture: ComponentFixture<ProductMfeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductMfeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductMfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
