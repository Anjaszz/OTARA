import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonSpinner,
  IonToast
} from '@ionic/angular/standalone';
import { AuthService, LoginRequest } from 'src/app/services/auth.service';
import { IconModule } from 'src/app/components/icon/icon.module';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
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
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
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
        email: this.loginForm.value.email,
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
          const errorMessage = error.message || 'Email atau password salah';
          this.showToastMessage(errorMessage, 'danger');
          console.error('Login error:', error);
        }
      });
    } else {
      this.showToastMessage('Mohon lengkapi email dan password dengan benar.', 'danger');
    }
  }

  navigateToRegister() {
    this.router.navigate(['/on-boarding']);
  }

  forgotPassword() {
    this.showToastMessage('Fitur reset password akan segera tersedia.', 'medium');
  }

  private showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}