import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLectionComponent } from './edit-lection.component';

describe('EditLectionComponent', () => {
  let component: EditLectionComponent;
  let fixture: ComponentFixture<EditLectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditLectionComponent]
    });
    fixture = TestBed.createComponent(EditLectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
