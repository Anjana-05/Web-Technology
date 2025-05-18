import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorCheckoutComponent } from './visitor-checkout.component';

describe('VisitorCheckoutComponent', () => {
  let component: VisitorCheckoutComponent;
  let fixture: ComponentFixture<VisitorCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisitorCheckoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitorCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
