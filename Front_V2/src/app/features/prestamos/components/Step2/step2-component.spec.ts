import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Step2Component } from './step2-component';

describe('Step2Component', () => {
  let component: Step2Component;
  let fixture: ComponentFixture<Step2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Step2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Step2Component);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
