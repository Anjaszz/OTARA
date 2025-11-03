import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonIcon,
  ToastController, IonToolbar, IonTitle, IonButtons } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera, save, close, arrowBack, cloudUpload, checkmarkCircle, chevronDown } from 'ionicons/icons';
import { BottomNavbarComponent } from "src/app/components/dashboard/nav-bottom/navbar-bottom.component";
import { ProductService, Category } from '../../../services/product.service';
import { ButtonComponent } from "src/app/components/button/button.component";

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [IonButtons, IonTitle, IonToolbar,
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonIcon,
    BottomNavbarComponent, ButtonComponent],
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss']
})
export class AddProductPage implements OnInit {
  product = {
    nama: '',
    harga: 0,
    kategori: '',
    deskripsi: ''
  };

  categories: Category[] = [];
  selectedFiles: File[] = [];
  previewImages: string[] = [];
  isLoading = false;
  isSaving = false;

  constructor(
    private router: Router,
    private productService: ProductService,
    private toastController: ToastController
  ) {
    addIcons({ camera, save, close, arrowBack, cloudUpload, checkmarkCircle, chevronDown });
  }

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
        this.showToast('Gagal memuat kategori', 'danger');
      }
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;

    if (this.selectedFiles.length + files.length > 5) {
      this.showToast('Maksimal 5 foto produk', 'warning');
      return;
    }

    for (let file of files) {
      if (file.type.startsWith('image/')) {
        this.selectedFiles.push(file);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewImages.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number) {
    this.selectedFiles.splice(index, 1);
    this.previewImages.splice(index, 1);
  }

  triggerFileInput() {
    document.getElementById('fileInput')?.click();
  }

  async saveProduct() {
    // Validation
    if (!this.product.nama || !this.product.kategori || !this.product.harga) {
      this.showToast('Mohon lengkapi semua field yang wajib', 'warning');
      return;
    }

    if (this.selectedFiles.length === 0) {
      this.showToast('Minimal 1 foto produk wajib diupload', 'warning');
      return;
    }

    this.isSaving = true;

    const formData = new FormData();
    formData.append('nama', this.product.nama);
    formData.append('deskripsi', this.product.deskripsi);
    formData.append('harga', this.product.harga.toString());
    formData.append('kategori', this.product.kategori);

    // Append all images
    this.selectedFiles.forEach((file) => {
      formData.append('foto', file);
    });

    this.productService.addProduct(formData).subscribe({
      next: (response) => {
        this.isSaving = false;
        if (response.success) {
          this.showToast('Produk berhasil ditambahkan', 'success');
          setTimeout(() => {
            this.router.navigate(['/seller/home']);
          }, 1000);
        }
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Error adding product:', error);
        this.showToast(error.message || 'Gagal menambahkan produk', 'danger');
      }
    });
  }

  cancel() {
    this.router.navigate(['/seller/home']);
  }

  // Format price with thousand separator
  formatPrice(value: number): string {
    if (!value || value === 0) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  // Handle price input
  onPriceInput(event: any) {
    const input = event.target.value;
    // Remove all non-numeric characters except digits
    const numericValue = input.replace(/\D/g, '');
    // Convert to number
    this.product.harga = numericValue ? parseInt(numericValue, 10) : 0;
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
