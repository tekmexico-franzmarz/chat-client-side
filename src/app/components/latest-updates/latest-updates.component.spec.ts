import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestUpdatesComponent } from './latest-updates.component';

describe('LatestUpdatesComponent', () => {
  let component: LatestUpdatesComponent;
  let fixture: ComponentFixture<LatestUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestUpdatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
