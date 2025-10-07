import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, searchOutline, closeCircle, funnelOutline } from 'ionicons/icons';
import { ProductService, Product, Category, SellerInfo } from '../../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonIcon, IonSpinner, CommonModule, FormsModule, RouterLink]
})
export class ProductsPage implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  isLoading = false;
  isLoadingCategories = false;

  // Filter state
  searchQuery = '';
  selectedCategory = '';
  selectedSort: 'terbaru' | 'termurah' | 'termahal' = 'terbaru';
  showFilters = false;

  // Pagination
  currentPage = 1;
  totalPages = 1;
  totalProducts = 0;
  limit = 20;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    addIcons({ arrowBack, searchOutline, closeCircle, funnelOutline });
  }

  ngOnInit() {
    // Check if there's a category filter from navigation
    this.route.queryParams.subscribe(params => {
      if (params['kategori']) {
        this.selectedCategory = params['kategori'];
        this.showFilters = true; // Show filters if category is preselected
      }
    });

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
        }
      },
      error: (error) => {
        this.isLoadingCategories = false;
        console.error('Error loading categories:', error);
      }
    });
  }

  loadProducts() {
    this.isLoading = true;

    const params: any = {
      sortBy: this.selectedSort,
      page: this.currentPage,
      limit: this.limit
    };

    if (this.searchQuery) {
      params.search = this.searchQuery;
    }

    if (this.selectedCategory) {
      params.kategori = this.selectedCategory;
    }

    this.productService.getProducts(params).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.products = response.data as Product[];
          this.totalProducts = response.total || 0;
          this.totalPages = response.pages || 1;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading products:', error);
      }
    });
  }

  // Filter actions
  onSearchChange() {
    this.currentPage = 1;
    this.loadProducts();
  }

  clearSearch() {
    this.searchQuery = '';
    this.currentPage = 1;
    this.loadProducts();
  }

  selectCategory(categoryName: string) {
    this.selectedCategory = categoryName === this.selectedCategory ? '' : categoryName;
    this.currentPage = 1;
    this.loadProducts();
  }

  selectSort(sort: 'terbaru' | 'termurah' | 'termahal') {
    this.selectedSort = sort;
    this.currentPage = 1;
    this.loadProducts();
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }

  clearAllFilters() {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedSort = 'terbaru';
    this.currentPage = 1;
    this.loadProducts();
  }

  // Helper methods
  getSellerName(product: Product): string {
    if (typeof product.sellerId === 'object') {
      return product.sellerId.namaToko;
    }
    return '';
  }

  getSellerLocation(product: Product): string {
    if (typeof product.sellerId === 'object') {
      return product.sellerId.domisili;
    }
    return '';
  }

  getProductImage(product: Product): string {
    return product.foto && product.foto.length > 0 ? product.foto[0] : 'assets/placeholder.jpg';
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  viewProductDetail(productId: string) {
    this.router.navigate(['/product-detail', productId]);
  }
}
