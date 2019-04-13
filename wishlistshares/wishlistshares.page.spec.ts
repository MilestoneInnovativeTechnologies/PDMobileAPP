import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistsharesPage } from './wishlistshares.page';

describe('WishlistsharesPage', () => {
  let component: WishlistsharesPage;
  let fixture: ComponentFixture<WishlistsharesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WishlistsharesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WishlistsharesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
