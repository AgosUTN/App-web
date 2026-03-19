import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticasSancionRead } from './politicas-sancion-read';

describe('PoliticasSancionRead', () => {
  let component: PoliticasSancionRead;
  let fixture: ComponentFixture<PoliticasSancionRead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticasSancionRead]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoliticasSancionRead);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
