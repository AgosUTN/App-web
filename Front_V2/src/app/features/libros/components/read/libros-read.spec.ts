import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrosRead } from './libros-read';

describe('LibrosRead', () => {
  let component: LibrosRead;
  let fixture: ComponentFixture<LibrosRead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibrosRead]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibrosRead);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
