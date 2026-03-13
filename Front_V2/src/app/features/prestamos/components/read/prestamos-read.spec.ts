import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamosRead } from './prestamos-read';

describe('PrestamosRead', () => {
  let component: PrestamosRead;
  let fixture: ComponentFixture<PrestamosRead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestamosRead]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestamosRead);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
