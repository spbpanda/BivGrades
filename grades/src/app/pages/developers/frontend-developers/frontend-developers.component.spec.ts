import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontendDevelopersComponent } from './frontend-developers.component';

describe('FrontendDevelopersComponent', () => {
  let component: FrontendDevelopersComponent;
  let fixture: ComponentFixture<FrontendDevelopersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontendDevelopersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrontendDevelopersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
