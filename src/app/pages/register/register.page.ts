import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonContent,
  IonSpinner,
  IonToast, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { IconModule } from 'src/app/components/icon/icon.module';
import { StorageService } from 'src/app/services/storage.service';
import { AuthService, RegisterSellerRequest } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';

interface ProductType {
  id: number;
  name: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonToolbar, IonHeader, 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonSpinner,
    IonToast,
    IconModule,
    RouterLink
  ],
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss']
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  showPassword = false;
  profileImage: string | null = null;
  profileImageFile: File | null = null;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = 'danger';

  // Modal properties
  isModalOpen = false;
  productTypes: ProductType[] = [];
  filteredProductTypes: ProductType[] = [];
  searchText = '';
  selectedProductType: string = '';

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private router: Router,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.registerForm = this.fb.group({
      namaToko: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      domisili: ['', Validators.required],
      jenisProdukUsaha: ['', Validators.required],
      nomorIzinUsaha: ['', Validators.required],
      alamatUsahaLengkap: ['', Validators.required],
      whatsapp: ['', Validators.required],
      facebook: [''],
      instagram: [''],
      setujuSyarat: [false, Validators.requiredTrue]
    });
  }

  ngOnInit() {
    console.log('Register page initialized');
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
    this.selectedProductType = productType.name;
    this.registerForm.patchValue({
      jenisProdukUsaha: productType.name
    });
    this.closeModal();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.profileImageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      // Validasi foto profil wajib diupload
      if (!this.profileImageFile) {
        this.showToastMessage('Foto profil wajib diupload', 'danger');
        return;
      }

      this.isLoading = true;

      const sellerData: RegisterSellerRequest = {
        namaToko: this.registerForm.value.namaToko,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        domisili: this.registerForm.value.domisili,
        jenisUsaha: this.registerForm.value.jenisProdukUsaha,
        nomorIzinUsaha: this.registerForm.value.nomorIzinUsaha,
        alamatUsaha: this.registerForm.value.alamatUsahaLengkap,
        whatsapp: this.registerForm.value.whatsapp,
        facebook: this.registerForm.value.facebook || '',
        instagram: this.registerForm.value.instagram || '',
        fotoProfil: this.profileImageFile
      };

      this.authService.registerSeller(sellerData).subscribe({
        next: (response) => {
          this.isLoading = false;

          // Set bahwa user sudah daftar (tidak first time lagi)
          this.storageService.setFirstTimeUser(false);

          this.showToastMessage(response.message, 'success');

          // Navigate to dashboard after 1.5 seconds
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 1500);
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = error.message || 'Terjadi kesalahan. Silakan coba lagi.';
          this.showToastMessage(errorMessage, 'danger');
          console.error('Registration error:', error);
        }
      });
    } else {
      this.showToastMessage('Mohon lengkapi semua field yang wajib diisi.', 'danger');
    }
  }

  private showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  // Getters for form controls
  get namaToko() {
    return this.registerForm.get('namaToko');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get domisili() {
    return this.registerForm.get('domisili');
  }

  get jenisProdukUsaha() {
    return this.registerForm.get('jenisProdukUsaha');
  }

  get nomorIzinUsaha() {
    return this.registerForm.get('nomorIzinUsaha');
  }

  get alamatUsahaLengkap() {
    return this.registerForm.get('alamatUsahaLengkap');
  }

  get whatsapp() {
    return this.registerForm.get('whatsapp');
  }
}
