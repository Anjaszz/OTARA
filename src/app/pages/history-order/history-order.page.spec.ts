import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryOrderPage } from './history-order.page';

describe('HistoryOrderPage', () => {
  let component: HistoryOrderPage;
  let fixture: ComponentFixture<HistoryOrderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryOrderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
