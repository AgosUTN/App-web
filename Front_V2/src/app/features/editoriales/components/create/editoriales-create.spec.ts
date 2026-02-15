import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorialesCreate } from './editoriales-create';

describe('EditorialesCreate', () => {
  let component: EditorialesCreate;
  let fixture: ComponentFixture<EditorialesCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorialesCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorialesCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
