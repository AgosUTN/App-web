import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyLayoutComponent } from './empty-layout-component';

describe('EmptyLayoutComponent', () => {
  let component: EmptyLayoutComponent;
  let fixture: ComponentFixture<EmptyLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
