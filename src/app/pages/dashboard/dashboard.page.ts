import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonToast,
  IonSpinner,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person } from 'ionicons/icons';
import { ProductService, Category, Product, SellerInfo } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

interface SliderItem {
  id: number;
  title: string;
  subtitle: string;
  backgroundImage: string;
  buttonText: string;
  route?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonIcon,
    IonSpinner
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit, OnDestroy {
  currentSlide = 0;
  private autoSlideInterval: any;
  isLoadingCategories = false;
  isLoadingProducts = false;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({ person });
  }

  sliderItems: SliderItem[] = [
    {
      id: 1,
      title: 'UMKM Naik Kelas Kota Bekasi',
      subtitle: 'Ayo dukung UMKM Lokal!',
      backgroundImage: 'assets/banner/banner-1.jpg',
      buttonText: 'Lihat Profil Kami',
      route: '/about-me'
    },
    {
      id: 2,
      title: 'Produk Lokal Terbaik',
      subtitle: 'Temukan produk berkualitas dari UMKM terpercaya',
      backgroundImage: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      buttonText: 'Jelajahi Sekarang'
    },
    {
      id: 3,
      title: 'Bergabung dengan Komunitas',
      subtitle: 'Wujudkan mimpi bisnis Anda bersama kami',
      backgroundImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      buttonText: 'Mulai Bisnis'
    }
  ];

  categories: Category[] = [];
  displayedCategories: Category[] = [];
  newProducts: Product[] = [];

  articles = [
    {
      id: 1,
      title: 'Tips Meningkatkan Penjualan UMKM di Era Digital',
      summary: 'Pelajari strategi pemasaran digital yang efektif untuk mengembangkan bisnis UMKM Anda',
      date: '2 hari yang lalu',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 2,
      title: 'Program Bantuan Modal untuk UMKM Kota Bekasi',
      summary: 'Pemerintah Kota Bekasi meluncurkan program bantuan modal bagi pelaku UMKM',
      date: '5 hari yang lalu',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 3,
      title: 'Kisah Sukses UMKM Lokal yang Go Internasional',
      summary: 'Inspirasi dari pelaku UMKM yang berhasil menembus pasar internasional',
      date: '1 minggu yang lalu',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    }
  ];

  ngOnInit() {
    // Auto slide functionality
    this.startAutoSlide();
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.isLoadingCategories = true;
    this.productService.getCategories().subscribe({
      next: (response) => {
        this.isLoadingCategories = false;
        if (response.success && response.data) {
          this.categories = response.data;
          // Display only first 5 categories on dashboard
          this.displayedCategories = this.categories.slice(0, 5);
        }
      },
      error: (error) => {
        this.isLoadingCategories = false;
        console.error('Error loading categories:', error);
      }
    });
  }

  loadProducts() {
    this.isLoadingProducts = true;
    // Load latest products with limit 10
    this.productService.getProducts({ sortBy: 'terbaru', limit: 10 }).subscribe({
      next: (response) => {
        this.isLoadingProducts = false;
        if (response.success && response.data) {
          this.newProducts = response.data as Product[];
        }
      },
      error: (error) => {
        this.isLoadingProducts = false;
        console.error('Error loading products:', error);
      }
    });
  }

  // Get seller name from product
  getSellerName(product: Product): string {
    if (typeof product.sellerId === 'object') {
      return product.sellerId.namaToko;
    }
    return '';
  }

  // Get seller location from product
  getSellerLocation(product: Product): string {
    if (typeof product.sellerId === 'object') {
      return product.sellerId.domisili;
    }
    return '';
  }

  // Get product main image
  getProductImage(product: Product): string {
    return product.foto && product.foto.length > 0 ? product.foto[0] : 'assets/placeholder.jpg';
  }

  // Map category name to static image
  getCategoryImage(categoryName: string): string {
    const categoryMap: { [key: string]: string } = {
      'Makanan': 'assets/category/Rice.svg',
      'Minuman': 'assets/category/Drinks.svg',
      'Manisan': 'assets/category/Sweets.svg',
      'Bumbu': 'assets/category/Spices.svg',
      'Kerajinan': 'assets/category/Crafts.svg',
      'Fashion': 'assets/category/Fashion.svg',
      'Elektronik': 'assets/category/Electronics.svg',
      'Sembako': 'assets/category/Rice.svg'
    };

    return categoryMap[categoryName] || 'assets/category/Rice.svg';
  }

  ngOnDestroy() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      const container = document.querySelector('#sliderContainer') as HTMLElement;
      if (container) {
        const slideWidth = container.offsetWidth;
        const nextSlide = (this.currentSlide + 1) % this.sliderItems.length;
        container.scrollTo({
          left: nextSlide * slideWidth,
          behavior: 'smooth'
        });
        this.currentSlide = nextSlide;
      }
    }, 5000);
  }

  onScroll(event: any) {
    const container = event.target;
    const slideWidth = container.offsetWidth;
    const scrollLeft = container.scrollLeft;
    const newSlide = Math.round(scrollLeft / slideWidth);

    if (newSlide !== this.currentSlide) {
      this.currentSlide = newSlide;
    }
  }

  async goToProfile() {
    const user = this.authService.currentUserValue;

    if (!user) {
      // User not logged in, show toast
      const toast = await this.toastController.create({
        message: 'Silakan login terlebih dahulu untuk mengakses profil',
        duration: 2500,
        position: 'top',
        color: 'warning',
        cssClass: 'custom-toast'
      });
      await toast.present();
      return;
    }

    // User is logged in, navigate to profile
    this.router.navigate(['/buyer/profile']);
  }

  viewProductDetail(productId: string) {
    this.router.navigate(['/product-detail', productId]);
  }

  viewCategoryProducts(categoryName: string) {
    this.router.navigate(['/products'], {
      queryParams: { kategori: categoryName }
    });
  }
}