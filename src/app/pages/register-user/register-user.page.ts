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
import { AuthService, RegisterBuyerRequest } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register-user',
  standalone: true,
  imports: [IonToolbar, IonHeader, CommonModule, FormsModule, ReactiveFormsModule, IonContent, IonSpinner, IonToast, IconModule, RouterLink],
  templateUrl: 'register-user.page.html',
  styleUrls: []
})
export class RegisterUserPage implements OnInit {

  registerForm: FormGroup;
  showPassword = false;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = 'danger';

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      nama: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      setujuSyarat: [false, Validators.requiredTrue]
    });
  }

  ngOnInit() {
    console.log('Register User page initialized');
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;

      const buyerData: RegisterBuyerRequest = {
        nama: this.registerForm.value.nama,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.authService.registerBuyer(buyerData).subscribe({
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
  get nama() {
    return this.registerForm.get('nama');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }
}
