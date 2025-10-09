import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditSellerProfilePage } from './edit-seller-profile.page';

describe('EditSellerProfilePage', () => {
  let component: EditSellerProfilePage;
  let fixture: ComponentFixture<EditSellerProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSellerProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
