import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SociosCreate } from './socios-create';

describe('SociosCreate', () => {
  let component: SociosCreate;
  let fixture: ComponentFixture<SociosCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SociosCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SociosCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
