import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoresRead } from './autores-read';

describe('AutoresRead', () => {
  let component: AutoresRead;
  let fixture: ComponentFixture<AutoresRead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutoresRead]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutoresRead);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
