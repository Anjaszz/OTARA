import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from '../../icon/icon.module';
import { RouterModule, Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-bottom-navbar',
  standalone: true,
  imports: [CommonModule, IconModule, RouterModule,RouterLink],
  templateUrl: './navbar-bottom.component.html',
  styleUrls: ['./navbar-bottom.component.scss']
})
export class BottomNavbarComponent implements OnInit {
  isAccountLocked = false;
  isAccountSuspended = false;
  accountStatus = 0;
  lockedmodal = false;
  userName = '';
  userRole = '';

  ngOnInit(): void {
  
  }

  constructor(
    private router: Router,
  ) {}

  isActive(route: string): boolean {
    return this.router.url === route;
  }

  isAccountRestricted(): boolean {
    return this.isAccountLocked || this.isAccountSuspended;
  }

  // Handle "Buat Kiriman" button click with account status check
  handleBuatKiriman() {
    if (this.isAccountRestricted()) {
      // If account is locked/suspended, show the modal
      this.openLockedModal();
    } else {
      // If account is active, navigate to buat-pesanan page
      this.router.navigate(['/buat-pesanan']);
    }
  }

  openLockedModal() {
    this.lockedmodal = true;
  }
  
  closeLockModal() {
    this.lockedmodal = false;
  }

}