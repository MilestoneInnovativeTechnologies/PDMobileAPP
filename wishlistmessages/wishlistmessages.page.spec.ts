import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistmessagesPage } from './wishlistmessages.page';

describe('WishlistmessagesPage', () => {
  let component: WishlistmessagesPage;
  let fixture: ComponentFixture<WishlistmessagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishlistmessagesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistmessagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
