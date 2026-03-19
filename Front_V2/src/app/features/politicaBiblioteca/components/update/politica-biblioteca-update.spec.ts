import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticaBibliotecaUpdate } from './politica-biblioteca-update';

describe('PoliticaBibliotecaUpdate', () => {
  let component: PoliticaBibliotecaUpdate;
  let fixture: ComponentFixture<PoliticaBibliotecaUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliticaBibliotecaUpdate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoliticaBibliotecaUpdate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
