import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonSpinner, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, shareOutline, close, logoWhatsapp, logoFacebook, logoInstagram, chevronDown, chevronUp } from 'ionicons/icons';
import { ProductService, Product, SellerInfo } from '../../services/product.service';
import { SellerService } from '../../services/seller.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonIcon, IonSpinner, IonModal, CommonModule, FormsModule, RouterLink]
})
export class ProductDetailPage implements OnInit {
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
    private sellerService: SellerService
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
    this.router.navigate(['/products']);
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

  getSellerName(): string {
    if (this.product && typeof this.product.sellerId === 'object') {
      return this.product.sellerId.namaToko;
    }
    return '';
  }

  getSellerPhoto(): string {
    if (this.product && typeof this.product.sellerId === 'object') {
      return this.product.sellerId.fotoProfil || 'assets/placeholder-avatar.jpg';
    }
    return 'assets/placeholder-avatar.jpg';
  }

  getSellerLocation(): string {
    if (this.product && typeof this.product.sellerId === 'object') {
      return this.product.sellerId.domisili;
    }
    return '';
  }

  getSellerId(): string {
    if (this.product && typeof this.product.sellerId === 'object') {
      return this.product.sellerId._id;
    }
    return typeof this.product?.sellerId === 'string' ? this.product.sellerId : '';
  }

  getWhatsappNumber(): string {
    if (this.product && typeof this.product.sellerId === 'object') {
      return this.product.sellerId.whatsapp || '';
    }
    return '';
  }

  viewSellerProfile() {
    const sellerId = this.getSellerId();
    if (sellerId) {
      this.router.navigate(['/seller-public-profile', sellerId]);
    }
  }

  contactViaWhatsapp() {
    const whatsappNumber = this.getWhatsappNumber();
    if (whatsappNumber && this.product) {
      const message = `Halo, saya tertarik dengan produk *${this.product.nama}* seharga Rp ${this.product.harga.toLocaleString('id-ID')}`;
      const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
      const whatsappUrl = `https://wa.me/62${cleanNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  }

  shareToWhatsapp() {
    if (this.product) {
      const url = window.location.href;
      const message = `Lihat produk ini: *${this.product.nama}* - Rp ${this.product.harga.toLocaleString('id-ID')}\n${url}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      this.showShareModal = false;
    }
  }

  shareToFacebook() {
    const url = window.location.href;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
    this.showShareModal = false;
  }

  copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('Link berhasil disalin!');
      this.showShareModal = false;
    });
  }
}
