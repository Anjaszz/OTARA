import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, locationOutline, callOutline, logoWhatsapp, logoFacebook, logoInstagram, storefrontOutline } from 'ionicons/icons';
import { SellerService, SellerProfile } from '../../services/seller.service';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-seller-public-profile',
  templateUrl: './seller-public-profile.page.html',
  styleUrls: ['./seller-public-profile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonIcon, IonSpinner, CommonModule, FormsModule,RouterLink]
})
export class SellerPublicProfilePage implements OnInit {
  seller: SellerProfile | null = null;
  products: Product[] = [];
  isLoadingSeller = false;
  isLoadingProducts = false;
  sellerId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private sellerService: SellerService
  ) {
    addIcons({
      arrowBack,
      locationOutline,
      callOutline,
      logoWhatsapp,
      logoFacebook,
      logoInstagram,
      storefrontOutline
    });
  }

  ngOnInit() {
    this.sellerId = this.route.snapshot.paramMap.get('sellerId') || '';
    if (this.sellerId) {
      this.loadSellerProfile();
      this.loadSellerProducts();
    }
  }

  loadSellerProfile() {
    this.isLoadingSeller = true;
    this.sellerService.getPublicSellerProfile(this.sellerId).subscribe({
      next: (response) => {
        this.isLoadingSeller = false;
        if (response.success && response.data) {
          this.seller = response.data;
        }
      },
      error: (error) => {
        this.isLoadingSeller = false;
        console.error('Error loading seller profile:', error);
      }
    });
  }

  loadSellerProducts() {
    this.isLoadingProducts = true;
    this.sellerService.getSellerProducts(this.sellerId).subscribe({
      next: (response) => {
        this.isLoadingProducts = false;
        if (response.success && response.data) {
          this.products = response.data;
        }
      },
      error: (error) => {
        this.isLoadingProducts = false;
        console.error('Error loading seller products:', error);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  getProductImage(product: Product): string {
    return product.foto && product.foto.length > 0 ? product.foto[0] : 'assets/placeholder.jpg';
  }

  viewProductDetail(productId: string) {
    this.router.navigate(['/product-detail', productId]);
  }

  contactViaWhatsapp() {
    if (this.seller && this.seller.whatsapp) {
      const message = `Halo, saya tertarik dengan produk dari *${this.seller.namaToko}*`;
      const cleanNumber = this.seller.whatsapp.replace(/[^0-9]/g, '');
      const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  }

  openFacebook() {
    if (this.seller && this.seller.facebook) {
      window.open(`${this.seller.facebook}`, '_blank');
    }
  }

  openInstagram() {
    if (this.seller && this.seller.instagram) {
      window.open(`${this.seller.instagram}`, '_blank');
    }
  }
}
