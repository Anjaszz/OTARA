import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class SplashPage implements OnInit {

  constructor(
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.checkUserStatus();
    }, 2000); // Tampilkan splash selama 2 detik
  }

  private checkUserStatus() {
    // Cek apakah user sudah login
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
      return;
    }

    // Cek apakah first time user
    if (this.storageService.isFirstTimeUser()) {
      this.router.navigate(['/on-boarding']);
    } else {
      this.router.navigate(['/masuk']);
    }
  }
}