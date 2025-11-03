import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonIcon,
  IonSpinner,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  storefront,
  location,
  business,
  document,
  home,
  logoWhatsapp,
  logoFacebook,
  logoInstagram,
  camera,
  checkmarkCircle,
  closeCircle,
  informationCircle
} from 'ionicons/icons';
import { SellerService, SellerProfile } from '../../../services/seller.service';
import { HttpClient } from '@angular/common/http';

interface ProductType {
  id: number;
  name: string;
}

@Component({
  selector: 'app-edit-seller-profile',
  templateUrl: './edit-seller-profile.page.html',
  styleUrls: ['./edit-seller-profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonSpinner
  ]
})
export class EditSellerProfilePage implements OnInit {
  seller: SellerProfile | null = null;
  isLoading = false;
  isSaving = false;

  // Form fields
  namaToko: string = '';
  domisili: string = '';
  jenisUsaha: string = '';
  nomorIzinUsaha: string = '';
  alamatUsaha: string = '';
  whatsapp: string = '';
  facebook: string = '';
  instagram: string = '';
  fotoProfil: File | null = null;
  fotoProfilPreview: string = '';

  // Modal properties
  isModalOpen = false;
  productTypes: ProductType[] = [];
  filteredProductTypes: ProductType[] = [];
  searchText = '';

  constructor(
    private router: Router,
    private sellerService: SellerService,
    private toastController: ToastController,
    private http: HttpClient
  ) {
    addIcons({
      arrowBack,
      storefront,
      location,
      business,
      document,
      home,
      logoWhatsapp,
      logoFacebook,
      logoInstagram,
      camera,
      checkmarkCircle,
      closeCircle,
      informationCircle
    });
  }

  ngOnInit() {
    this.loadSellerProfile();
    this.loadProductTypes();
  }

  loadProductTypes() {
    this.http.get<ProductType[]>('assets/data/product-types.json').subscribe({
      next: (data) => {
        this.productTypes = data;
        this.filteredProductTypes = data;
      },
      error: (err) => {
        console.error('Error loading product types:', err);
      }
    });
  }

  openModal() {
    this.isModalOpen = true;
    this.searchText = '';
    this.filteredProductTypes = this.productTypes;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onSearchChange(event: any) {
    const searchValue = this.searchText.toLowerCase();

    if (searchValue.trim() === '') {
      this.filteredProductTypes = this.productTypes;
    } else {
      this.filteredProductTypes = this.productTypes.filter(type =>
        type.name.toLowerCase().includes(searchValue)
      );
    }
  }

  selectProductType(productType: ProductType) {
    this.jenisUsaha = productType.name;
    this.closeModal();
  }

  loadSellerProfile() {
    this.isLoading = true;
    this.sellerService.getSellerProfile().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.seller = response.data;
          // Populate form fields
          this.namaToko = response.data.namaToko;
          this.domisili = response.data.domisili;
          this.jenisUsaha = response.data.jenisUsaha;
          this.nomorIzinUsaha = response.data.nomorIzinUsaha;
          this.alamatUsaha = response.data.alamatUsaha;
          this.whatsapp = response.data.whatsapp;
          this.facebook = response.data.facebook || '';
          this.instagram = response.data.instagram || '';
          this.fotoProfilPreview = response.data.fotoProfil;
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading seller profile:', error);
        this.showToast('Gagal memuat profil', 'danger');
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.showToast('File harus berupa gambar', 'warning');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.showToast('Ukuran file maksimal 5MB', 'warning');
        return;
      }

      this.fotoProfil = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoProfilPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async saveProfile() {
    // Validation
    if (!this.namaToko || this.namaToko.trim() === '') {
      this.showToast('Nama toko wajib diisi', 'warning');
      return;
    }
    if (!this.domisili || this.domisili.trim() === '') {
      this.showToast('Domisili wajib diisi', 'warning');
      return;
    }
    if (!this.jenisUsaha || this.jenisUsaha.trim() === '') {
      this.showToast('Jenis usaha wajib diisi', 'warning');
      return;
    }
    if (!this.nomorIzinUsaha || this.nomorIzinUsaha.trim() === '') {
      this.showToast('Nomor izin usaha wajib diisi', 'warning');
      return;
    }
    if (!this.alamatUsaha || this.alamatUsaha.trim() === '') {
      this.showToast('Alamat usaha wajib diisi', 'warning');
      return;
    }
    if (!this.whatsapp || this.whatsapp.trim() === '') {
      this.showToast('WhatsApp wajib diisi', 'warning');
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append('namaToko', this.namaToko.trim());
    formData.append('domisili', this.domisili.trim());
    formData.append('jenisUsaha', this.jenisUsaha.trim());
    formData.append('nomorIzinUsaha', this.nomorIzinUsaha.trim());
    formData.append('alamatUsaha', this.alamatUsaha.trim());
    formData.append('whatsapp', this.whatsapp.trim());

    if (this.facebook) {
      formData.append('facebook', this.facebook.trim());
    }
    if (this.instagram) {
      formData.append('instagram', this.instagram.trim());
    }
    if (this.fotoProfil) {
      formData.append('fotoProfil', this.fotoProfil);
    }

    this.isSaving = true;
    this.sellerService.updateSellerProfile(formData).subscribe({
      next: (response) => {
        this.isSaving = false;
        if (response.success) {
          this.showToast('Profil toko berhasil diupdate', 'success');
          setTimeout(() => {
            this.router.navigate(['/seller/profile']);
          }, 500);
        }
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Error updating profile:', error);
        const errorMessage = error.error?.message || 'Gagal mengupdate profil';
        this.showToast(errorMessage, 'danger');
      }
    });
  }

  goBack() {
    this.router.navigate(['/seller/profile']);
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
