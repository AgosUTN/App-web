import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamosDetailDialog } from './prestamos-detail-dialog';

describe('PrestamosDetailDialog', () => {
  let component: PrestamosDetailDialog;
  let fixture: ComponentFixture<PrestamosDetailDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestamosDetailDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestamosDetailDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
