import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticasSancionCreate } from './politicas-sancion-create';

describe('PoliticasSancionCreate', () => {
  let component: PoliticasSancionCreate;
  let fixture: ComponentFixture<PoliticasSancionCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticasSancionCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoliticasSancionCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
