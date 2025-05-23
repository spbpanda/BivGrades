import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiButtonComponent } from './sbi-button.component';

describe('SbiButtonComponent', () => {
  let component: SbiButtonComponent;
  let fixture: ComponentFixture<SbiButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
