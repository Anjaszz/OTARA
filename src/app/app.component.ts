import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, ToastController } from '@ionic/angular/standalone';
import { AlertComponent } from "./components/alert/alert.component";
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, AlertComponent],
})
export class AppComponent implements OnInit {
  backButtonPressedOnce = false;
  backButtonTimeout: any;

  constructor(
    private platform: Platform,
    private router: Router,
    private location: Location,
    private toastController: ToastController
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    // Configure StatusBar for Android 12+ safe area
    if (this.platform.is('capacitor')) {
      await StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#59AC77' });
    }

    // Show splash screen
    await SplashScreen.show({
      showDuration: 3000,
      autoHide: true,
    });

    // Handle deep links
    this.setupDeepLinking();

    this.backButtonEvent();
  }

  setupDeepLinking() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.handleDeepLink(event.url);
    });
  }

  handleDeepLink(url: string) {
    console.log('Deep link received:', url);

    // Parse URL: umkmapp://product/PRODUCT_ID
    // or: https://your-domain.com/product/PRODUCT_ID

    try {
      if (url.includes('product/')) {
        const productId = url.split('product/')[1].split('?')[0];

        // Navigate to product detail
        this.router.navigateByUrl(`/product-detail/${productId}`);
      } else if (url.includes('seller/')) {
        const sellerId = url.split('seller/')[1].split('?')[0];

        // Navigate to seller profile
        this.router.navigateByUrl(`/seller-public-profile/${sellerId}`);
      }
    } catch (error) {
      console.error('Error handling deep link:', error);
    }
  }

  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      const url = this.router.url;
      if (url === '/dashboard' || url === '/masuk' || url === '/') {
        if (this.backButtonPressedOnce) {
          clearTimeout(this.backButtonTimeout);
          App.exitApp();
        } else {
          this.backButtonPressedOnce = true;
          this.presentToast('Tekan sekali lagi untuk keluar');
          this.backButtonTimeout = setTimeout(() => {
            this.backButtonPressedOnce = false;
          }, 2000);
        }
      } else {
        this.location.back();
      }
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'custom-toast',
    });
    toast.present();
  }

  ngOnInit() {}
}
