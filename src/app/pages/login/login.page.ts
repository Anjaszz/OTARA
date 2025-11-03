import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonSpinner,
  IonToast, IonToolbar } from '@ionic/angular/standalone';
import { AuthService, LoginRequest } from 'src/app/services/auth.service';
import { IconModule } from 'src/app/components/icon/icon.module';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonToolbar, 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonSpinner,
    IonToast,IconModule,RouterLink
  ]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  showPassword = false;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastColor = 'danger';
  returnUrl = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private storageService: StorageService
  ) {
    this.loginForm = this.fb.group({
      emailOrPhone: ['', [Validators.required, this.emailOrPhoneValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  // Custom validator untuk email atau nomor telepon
  emailOrPhoneValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Biarkan Validators.required yang handle
    }

    const value = control.value.trim();

    // Cek apakah ini nomor telepon (hanya digit, bisa diawali +)
    const phonePattern = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    const isPhone = /^[\+]?[0-9]{10,15}$/.test(value.replace(/[\s\-\(\)]/g, ''));

    // Cek apakah ini email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isEmail = emailPattern.test(value);

    if (isEmail || isPhone) {
      return null; // Valid
    }

    return { emailOrPhone: true }; // Invalid
  }

  ngOnInit() {
    // Get return url from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    
    // Redirect if already logged in
    if (this.authService.isAuthenticated) {
      this.router.navigate([this.returnUrl]);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const credentials: LoginRequest = {
        emailOrPhone: this.loginForm.value.emailOrPhone,
        password: this.loginForm.value.password,
        rememberMe: this.loginForm.value.rememberMe
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;

          // Set bahwa user sudah login (tidak first time lagi)
          this.storageService.setFirstTimeUser(false);
          localStorage.setItem('isFirstTime', 'false');

          this.showToastMessage(response.message, 'success');

          // Redirect based on user role from response
          const userRole = response.data.user.role;
          const redirectUrl = userRole === 'seller' ? '/seller/home' : '/dashboard';

          setTimeout(() => {
            this.router.navigate([redirectUrl]);
          }, 1000);
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = error.message || 'Email/nomor telepon atau password salah';
          this.showToastMessage(errorMessage, 'danger');
          console.error('Login error:', error);
        }
      });
    } else {
      this.showToastMessage('Mohon lengkapi email/nomor telepon dan password dengan benar.', 'danger');
    }
  }

  navigateToRegister() {
    this.router.navigate(['/on-boarding']);
  }

  forgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  private showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  get emailOrPhone() {
    return this.loginForm.get('emailOrPhone');
  }

  get email() {
    return this.emailOrPhone; // Alias untuk backward compatibility di template
  }

  get password() {
    return this.loginForm.get('password');
  }
}