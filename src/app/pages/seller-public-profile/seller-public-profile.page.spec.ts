import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SellerPublicProfilePage } from './seller-public-profile.page';

describe('SellerPublicProfilePage', () => {
  let component: SellerPublicProfilePage;
  let fixture: ComponentFixture<SellerPublicProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerPublicProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
