import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamosCreate } from './prestamos-create';

describe('PrestamosCreate', () => {
  let component: PrestamosCreate;
  let fixture: ComponentFixture<PrestamosCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestamosCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestamosCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
