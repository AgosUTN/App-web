import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SociosRead } from './socios-read';

describe('SociosRead', () => {
  let component: SociosRead;
  let fixture: ComponentFixture<SociosRead>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SociosRead]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SociosRead);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
