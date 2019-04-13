import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsharelistPage } from './addsharelist.page';

describe('AddsharelistPage', () => {
  let component: AddsharelistPage;
  let fixture: ComponentFixture<AddsharelistPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddsharelistPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsharelistPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
