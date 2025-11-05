import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButton,
  IonIcon,
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
import { IdrCurrencyPipe } from '../../../pipes/idr-currency.pipe';

@Component({
  selector: 'app-seller-home',
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButton,
    IonIcon,
    IonSpinner,
    RouterLink,
    BottomNavbarComponent,
    IdrCurrencyPipe
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
  isLoadingMore = false;
  currentPage = 1;
  totalPages = 1;
  hasMoreData = true;

  constructor(
    private router: Router,
    private productService: ProductService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({ addCircle, create, trash, ellipsisVertical });
  }

  ngOnInit() {
    this.loadProducts(true);
  }

  // This lifecycle hook is called every time the page is about to enter
  ionViewWillEnter() {
    console.log('Seller home page will enter - refreshing products');
    this.loadProducts(true);
  }

  loadProducts(reset: boolean = false) {
    if (reset) {
      this.currentPage = 1;
      this.products = [];
      this.hasMoreData = true;
      this.isLoading = true;
    } else {
      this.isLoadingMore = true;
    }

    if (!this.hasMoreData) return;

    this.productService.getSellerProducts(this.currentPage).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.isLoadingMore = false;

        if (response.success && response.data) {
          const newProducts = response.data as Product[];

          if (reset) {
            this.products = newProducts;
          } else {
            this.products = [...this.products, ...newProducts];
          }

          // Update pagination info
          this.totalProducts = response.total || 0;
          this.totalPages = response.pages || 1;
          this.hasMoreData = this.currentPage < this.totalPages;

          this.calculateStats();
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.isLoadingMore = false;
        console.error('Error loading products:', error);
        this.showToast('Gagal memuat produk', 'danger');
      }
    });
  }

  onScroll(event: any) {
    const scrollElement = event.target;
    const scrollPosition = scrollElement.scrollTop + scrollElement.clientHeight;
    const scrollHeight = scrollElement.scrollHeight;

    // Load more only when user reaches the bottom (with 10px tolerance for precision)
    const distanceFromBottom = scrollHeight - scrollPosition;

    if (distanceFromBottom <= 10 && !this.isLoadingMore && this.hasMoreData && !this.isLoading) {
      this.currentPage++;
      this.loadProducts(false);
    }
  }

  calculateStats() {
    // totalProducts sudah di-set dari response.total di loadProducts()
    this.activeProducts = this.products.length; // Total produk yang sudah di-load
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
