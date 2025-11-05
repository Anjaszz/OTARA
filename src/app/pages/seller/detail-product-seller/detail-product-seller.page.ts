import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonSpinner, IonModal, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, shareOutline, close, logoWhatsapp, logoFacebook, logoInstagram, chevronDown, chevronUp } from 'ionicons/icons';
import { ProductService, Product, SellerInfo } from '../../../services/product.service';
import { SellerService } from '../../../services/seller.service';
import { Share } from '@capacitor/share';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IdrCurrencyPipe } from '../../../pipes/idr-currency.pipe';

@Component({
  selector: 'app-detail-product-seller',
  templateUrl: './detail-product-seller.page.html',
  styleUrls: ['./detail-product-seller.page.scss'],
  standalone: true,
  imports: [IonToolbar, IonContent, IonHeader, IonIcon, IonSpinner, IonModal, CommonModule, FormsModule, RouterLink, IdrCurrencyPipe]
})
export class DetailProductSellerPage implements OnInit {

  product: Product | null = null;
  isLoading = false;
  showShareModal = false;
  showDescriptionFull = false;
  currentImageIndex = 0;
  productId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private sellerService: SellerService,
    private http: HttpClient
  ) {
    addIcons({ arrowBack, shareOutline, close, logoWhatsapp, logoFacebook, logoInstagram, chevronDown, chevronUp });
  }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    if (this.productId) {
      this.loadProduct();
    }
  }

  loadProduct() {
    this.isLoading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.product = response.data as Product;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading product:', error);
      }
    });
  }

  goBack() {
    this.router.navigate(['/seller/home']);
  }

  toggleShareModal() {
    this.showShareModal = !this.showShareModal;
  }

  toggleDescription() {
    this.showDescriptionFull = !this.showDescriptionFull;
  }

  changeImage(index: number) {
    if (this.product && this.product.foto) {
      this.currentImageIndex = index;
    }
  }

  getCurrentImage(): string {
    if (this.product && this.product.foto && this.product.foto.length > 0) {
      return this.product.foto[this.currentImageIndex] || this.product.foto[0];
    }
    return 'assets/placeholder.jpg';
  }


  async shareToWhatsapp() {
    if (this.product) {
      try {
        // Get share data from backend
        const response: any = await this.http.get(
          `${environment.apiUrl}/share/product/${this.productId}`
        ).toPromise();

        if (response.success && response.data.social.whatsapp) {
          window.open(response.data.social.whatsapp, '_system');
          this.showShareModal = false;
        }
      } catch (error) {
        console.error('Error sharing to WhatsApp:', error);
        // Fallback to local share
        const message = `Lihat produk ini: *${this.product.nama}* - Rp ${this.product.harga.toLocaleString('id-ID')}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_system');
        this.showShareModal = false;
      }
    }
  }

  async shareToFacebook() {
    try {
      // Get share data from backend
      const response: any = await this.http.get(
        `${environment.apiUrl}/share/product/${this.productId}`
      ).toPromise();

      if (response.success && response.data.social.facebook) {
        window.open(response.data.social.facebook, '_system');
        this.showShareModal = false;
      }
    } catch (error) {
      console.error('Error sharing to Facebook:', error);
      this.showShareModal = false;
    }
  }

  async copyLink() {
    try {
      // Get share data from backend
      const response: any = await this.http.get(
        `${environment.apiUrl}/share/product/${this.productId}`
      ).toPromise();

      if (response.success) {
        const url = response.data.universalLink || response.data.webLink;
        await navigator.clipboard.writeText(url);
        alert('Link berhasil disalin!');
        this.showShareModal = false;
      }
    } catch (error) {
      console.error('Error copying link:', error);
      this.showShareModal = false;
    }
  }

  // Native share using Capacitor
  async shareProduct() {
    try {
      // Get share data from backend
      const response: any = await this.http.get(
        `${environment.apiUrl}/share/product/${this.productId}`
      ).toPromise();

      if (response.success) {
        const shareData = response.data;

        // Use Capacitor Share API
        await Share.share({
          title: shareData.product.nama,
          text: shareData.shareText,
          url: shareData.universalLink,
          dialogTitle: 'Bagikan Produk'
        });
      }
    } catch (error) {
      console.error('Error sharing product:', error);
    }
  }

}
