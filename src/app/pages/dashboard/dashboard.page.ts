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
import { HttpClient } from '@angular/common/http';

interface SliderItem {
  id: number;
  title: string;
  subtitle: string;
  backgroundImage: string;
  buttonText: string;
  route?: string;
}

interface Article {
  id: number;
  title: string;
  summary: string;
  date: string;
  image: string;
  content?: string;
  author?: string;
  category?: string;
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
    private toastController: ToastController,
    private http: HttpClient
  ) {
    addIcons({ person });
  }

  sliderItems: SliderItem[] = [
    {
      id: 1,
      title: 'Peluncuran UMKM App Store',
      subtitle: 'Satu Platform Digital untuk Mendorong UMKM',
      backgroundImage: 'assets/article/article-1.jpg',
      buttonText: 'Jelajahi Sekarang',
      route: '/article-detail/1'
    },
    {
      id: 2,
      title: 'Pemberdayaan UMKM Berbasis Digital',
      subtitle: 'Peningkatan Mutu Produk dan Strategi Branding Online',
      backgroundImage: 'assets/article/Picture2.jpg',
      buttonText: 'Jelajahi Sekarang',
      route: '/article-detail/2'
    },
    {
      id: 3,
      title: 'Pemberdayaan Digital UMKM',
      subtitle: 'Pemasaran Modern Komunitas Bekasi',
      backgroundImage: 'assets/article/Picture3.jpg',
      buttonText: 'Jelajahi Sekarang',
      route: '/article-detail/3'
    }
  ];

  categories: Category[] = [];
  displayedCategories: Category[] = [];
  newProducts: Product[] = [];
  articles: Article[] = [];

  ngOnInit() {
    // Auto slide functionality
    this.startAutoSlide();
    this.loadCategories();
    this.loadProducts();
    this.loadArticles();
  }

  loadArticles() {
    this.http.get<Article[]>('assets/data/articles.json').subscribe({
      next: (data) => {
        this.articles = data;
      },
      error: (err) => {
        console.error('Error loading articles:', err);
      }
    });
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
      'Makanan': 'assets/category/Food.svg',
      'Minuman': 'assets/category/Drink.svg',
      'Fashion & Pakaian': 'assets/category/Fashion.png',
      'Kerajian Tangan': 'assets/category/Handicraft.png',
      'Produk Kecantikan & Perawatan Diri': 'assets/category/Beauty.png'
    };

    return categoryMap[categoryName] || 'assets/category/Food.svg';
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
      this.router.navigate(['/on-boarding']);
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

  viewArticleDetail(articleId: number) {
    this.router.navigate(['/article-detail', articleId]);
  }
}