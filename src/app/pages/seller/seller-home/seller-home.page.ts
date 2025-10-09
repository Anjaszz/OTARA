import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonLabel,
  IonSpinner,
  AlertController,
  ToastController,
  ViewWillEnter
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircle, create, trash, ellipsisVertical } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
import { BottomNavbarComponent } from "src/app/components/dashboard/nav-bottom/navbar-bottom.component";
import { ProductService, Product } from '../../../services/product.service';

@Component({
  selector: 'app-seller-home',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonChip,
    IonLabel,
    IonSpinner,
    RouterLink,
    BottomNavbarComponent
  ],
  templateUrl: './seller-home.page.html',
  styleUrls: ['./seller-home.page.scss']
})
export class SellerHomePage implements OnInit, ViewWillEnter {
  products: Product[] = [];
  totalProducts = 0;
  activeProducts = 0;
  totalRevenue = 0;
  isLoading = false;

  constructor(
    private router: Router,
    private productService: ProductService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({ addCircle, create, trash, ellipsisVertical });
  }

  ngOnInit() {
    this.loadProducts();
  }

  // This lifecycle hook is called every time the page is about to enter
  ionViewWillEnter() {
    console.log('Seller home page will enter - refreshing products');
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getSellerProducts().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.products = response.data as Product[];
          this.calculateStats();
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading products:', error);
        this.showToast('Gagal memuat produk', 'danger');
      }
    });
  }

  calculateStats() {
    this.totalProducts = this.products.length;
    this.activeProducts = this.products.length; // Semua produk dari API dianggap aktif
    // Revenue bisa dihitung jika ada data penjualan
    this.totalRevenue = 0;
  }

  viewProductDetail(productId: string) {
    this.router.navigate(['/detail-product-seller', productId]);
  }

  editProduct(product: Product) {
    this.router.navigate(['/seller/edit-product', product._id]);
  }

  async deleteProduct(product: Product) {
    const alert = await this.alertController.create({
      header: 'Konfirmasi',
      message: `Apakah Anda yakin ingin menghapus produk "${product.nama}"?`,
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Hapus',
          role: 'destructive',
          handler: () => {
            this.confirmDelete(product._id);
          }
        }
      ]
    });

    await alert.present();
  }

  confirmDelete(productId: string) {
    this.productService.deleteProduct(productId).subscribe({
      next: (response) => {
        if (response.success) {
          this.showToast('Produk berhasil dihapus', 'success');
          this.loadProducts(); // Reload products
        }
      },
      error: (error) => {
        console.error('Error deleting product:', error);
        this.showToast(error.message || 'Gagal menghapus produk', 'danger');
      }
    });
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
