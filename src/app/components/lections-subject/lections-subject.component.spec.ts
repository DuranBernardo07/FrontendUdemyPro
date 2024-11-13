import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectionsSubjectComponent } from './lections-subject.component';

describe('LectionsSubjectComponent', () => {
  let component: LectionsSubjectComponent;
  let fixture: ComponentFixture<LectionsSubjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LectionsSubjectComponent]
    });
    fixture = TestBed.createComponent(LectionsSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
