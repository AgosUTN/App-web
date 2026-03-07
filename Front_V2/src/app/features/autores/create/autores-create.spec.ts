import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoresCreate } from './autores-create';

describe('AutoresCreate', () => {
  let component: AutoresCreate;
  let fixture: ComponentFixture<AutoresCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoresCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoresCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
