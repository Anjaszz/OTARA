import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailProductSellerPage } from './detail-product-seller.page';

describe('DetailProductSellerPage', () => {
  let component: DetailProductSellerPage;
  let fixture: ComponentFixture<DetailProductSellerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailProductSellerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
