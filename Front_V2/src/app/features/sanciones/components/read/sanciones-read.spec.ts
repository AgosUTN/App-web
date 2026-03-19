import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SancionesRead } from './sanciones-read';

describe('SancionesRead', () => {
  let component: SancionesRead;
  let fixture: ComponentFixture<SancionesRead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SancionesRead]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SancionesRead);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
