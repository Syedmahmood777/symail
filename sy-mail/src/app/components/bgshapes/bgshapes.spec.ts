import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bgshapes } from './bgshapes';

describe('Bgshapes', () => {
  let component: Bgshapes;
  let fixture: ComponentFixture<Bgshapes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bgshapes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bgshapes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
