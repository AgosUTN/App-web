import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SociosDetail } from './socios-detail';

describe('SociosDetail', () => {
  let component: SociosDetail;
  let fixture: ComponentFixture<SociosDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SociosDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SociosDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
