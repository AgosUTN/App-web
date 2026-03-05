import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrosDetailDialog } from './libros-detail-dialog';

describe('LibrosDetailDialog', () => {
  let component: LibrosDetailDialog;
  let fixture: ComponentFixture<LibrosDetailDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibrosDetailDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibrosDetailDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
