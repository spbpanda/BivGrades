import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessAnalyticsComponent } from './business-analytics.component';

describe('BusinessAnalyticsComponent', () => {
  let component: BusinessAnalyticsComponent;
  let fixture: ComponentFixture<BusinessAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
