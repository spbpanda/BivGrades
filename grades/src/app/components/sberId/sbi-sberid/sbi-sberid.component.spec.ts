import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SbiSberidComponent } from './sbi-sberid.component';

describe('SbiSberidComponent', () => {
  let component: SbiSberidComponent;
  let fixture: ComponentFixture<SbiSberidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SbiSberidComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SbiSberidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
