import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrosCreate } from './libros-create';

describe('LibrosCreate', () => {
  let component: LibrosCreate;
  let fixture: ComponentFixture<LibrosCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibrosCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibrosCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
