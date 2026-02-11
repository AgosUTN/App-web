import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editoriales } from './editoriales';

describe('Editoriales', () => {
  let component: Editoriales;
  let fixture: ComponentFixture<Editoriales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editoriales]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editoriales);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
