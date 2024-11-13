import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseLectionsComponent } from './course-lections.component';

describe('CourseLectionsComponent', () => {
  let component: CourseLectionsComponent;
  let fixture: ComponentFixture<CourseLectionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseLectionsComponent]
    });
    fixture = TestBed.createComponent(CourseLectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
