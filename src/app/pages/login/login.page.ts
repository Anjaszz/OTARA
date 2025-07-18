import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonSpinner,
  IonToast
} from '@ionic/angular/standalone';
import { AuthService, LoginRequest } from 'src/app/services/auth.service';

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
    IonToast
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
    private authService: AuthService
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
      
      try {
        const loginData: LoginRequest = {
          email: this.loginForm.value.email,
          password: this.loginForm.value.password,
          rememberMe: this.loginForm.value.rememberMe
        };

        const response = await this.authService.login(loginData).toPromise();
        
        if (response?.success) {
          this.showToastMessage('Login berhasil!', 'success');
          
          // Navigate to return URL or dashboard after successful login
          setTimeout(() => {
            this.router.navigate([this.returnUrl]);
          }, 1000);
        }
        
      } catch (error: any) {
        const errorMessage = error?.message || 'Login gagal. Periksa kembali email dan password Anda.';
        this.showToastMessage(errorMessage, 'danger');
      } finally {
        this.isLoading = false;
      }
    } else {
      this.showToastMessage('Mohon lengkapi semua field yang diperlukan.', 'warning');
    }
  }

  navigateToRegister() {
    this.router.navigate(['/daftar']);
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