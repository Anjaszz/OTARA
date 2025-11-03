import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonSpinner, IonToolbar } from '@ionic/angular/standalone';
import { ProductService, Category } from '../../services/product.service';
import { IconModule } from 'src/app/components/icon/icon.module';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [IonToolbar, 
    CommonModule,
    IonContent,
    IonHeader,
    IonSpinner,
    IconModule,
    RouterLink
  ],
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss']
})
export class CategoriesPage implements OnInit {
  categories: Category[] = [];
  isLoading = false;

  constructor(
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.productService.getCategories().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.categories = response.data;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading categories:', error);
      }
    });
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

  selectCategory(category: Category) {
    // Navigate to products page with category filter
    this.router.navigate(['/products'], {
      queryParams: { kategori: category.nama }
    });
  }
}
