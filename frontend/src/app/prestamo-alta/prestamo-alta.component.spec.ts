import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamoAltaComponent } from './prestamo-alta.component';

describe('PrestamoAltaComponent', () => {
  let component: PrestamoAltaComponent;
  let fixture: ComponentFixture<PrestamoAltaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestamoAltaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestamoAltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
