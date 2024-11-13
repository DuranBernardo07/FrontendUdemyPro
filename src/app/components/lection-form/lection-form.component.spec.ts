import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectionFormComponent } from './lection-form.component';

describe('LectionFormComponent', () => {
  let component: LectionFormComponent;
  let fixture: ComponentFixture<LectionFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LectionFormComponent]
    });
    fixture = TestBed.createComponent(LectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
