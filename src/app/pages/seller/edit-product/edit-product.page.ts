import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonBackButton,
  IonButtons,
  ToastController,
  IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera, save, close } from 'ionicons/icons';
import { BottomNavbarComponent } from "src/app/components/dashboard/nav-bottom/navbar-bottom.component";
import { ProductService, Category, Product } from '../../../services/product.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonLabel,
    IonBackButton,
    IonButtons,
    IonSpinner,
    BottomNavbarComponent
  ],
  templateUrl: './edit-product.page.html',
  styleUrls: ['./edit-product.page.scss']
})
export class EditProductPage implements OnInit {
  productId: string = '';
  product = {
    nama: '',
    harga: 0,
    kategori: '',
    deskripsi: ''
  };

  categories: Category[] = [];
  selectedFiles: File[] = [];
  previewImages: string[] = [];
  existingImages: string[] = [];
  isLoading = false;
  isSaving = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private toastController: ToastController
  ) {
    addIcons({ camera, save, close });
  }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    if (this.productId) {
      this.loadProductData();
    }
    this.loadCategories();
  }

  loadProductData() {
    this.isLoading = true;
    this.productService.getSellerProducts().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          const products = response.data as Product[];
          const product = products.find(p => p._id === this.productId);
          if (product) {
            this.product.nama = product.nama;
            this.product.harga = product.harga;
            this.product.kategori = product.kategori;
            this.product.deskripsi = product.deskripsi;
            this.existingImages = [...product.foto];
          } else {
            this.showToast('Produk tidak ditemukan', 'danger');
            this.router.navigate(['/seller/home']);
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading product:', error);
        this.showToast('Gagal memuat produk', 'danger');
      }
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    const totalImages = this.existingImages.length + this.selectedFiles.length + files.length;

    if (totalImages > 5) {
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

  removeNewImage(index: number) {
    this.selectedFiles.splice(index, 1);
    this.previewImages.splice(index, 1);
  }

  removeExistingImage(index: number) {
    this.existingImages.splice(index, 1);
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

    const totalImages = this.existingImages.length + this.selectedFiles.length;
    if (totalImages === 0) {
      this.showToast('Minimal 1 foto produk wajib ada', 'warning');
      return;
    }

    this.isSaving = true;

    const formData = new FormData();
    formData.append('nama', this.product.nama);
    formData.append('deskripsi', this.product.deskripsi);
    formData.append('harga', this.product.harga.toString());
    formData.append('kategori', this.product.kategori);

    // Append new images if any
    this.selectedFiles.forEach((file) => {
      formData.append('foto', file);
    });

    this.productService.updateProduct(this.productId, formData).subscribe({
      next: (response) => {
        this.isSaving = false;
        if (response.success) {
          this.showToast('Produk berhasil diupdate', 'success');
          setTimeout(() => {
            this.router.navigate(['/seller/home']);
          }, 1000);
        }
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Error updating product:', error);
        this.showToast(error.message || 'Gagal mengupdate produk', 'danger');
      }
    });
  }

  cancel() {
    this.router.navigate(['/seller/home']);
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
