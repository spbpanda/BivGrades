import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendDevelopersComponent } from './backend-developers.component';

describe('BackendDevelopersComponent', () => {
  let component: BackendDevelopersComponent;
  let fixture: ComponentFixture<BackendDevelopersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackendDevelopersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackendDevelopersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
