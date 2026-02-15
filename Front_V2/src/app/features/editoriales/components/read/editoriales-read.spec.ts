import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorialesRead } from './editoriales-read';

describe('EditorialesRead', () => {
  let component: EditorialesRead;
  let fixture: ComponentFixture<EditorialesRead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorialesRead]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorialesRead);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
