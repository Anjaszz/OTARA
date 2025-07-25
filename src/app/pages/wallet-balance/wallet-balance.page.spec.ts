import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WalletBalancePage } from './wallet-balance.page';

describe('WalletBalancePage', () => {
  let component: WalletBalancePage;
  let fixture: ComponentFixture<WalletBalancePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletBalancePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
