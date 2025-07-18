import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonIcon,
  IonToast
} from '@ionic/angular/standalone';
import { AuthService, User } from 'src/app/services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonIcon,
    IonToast
  ]
})
export class ProfilePage implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  currentUser: User | null = null;
  profileForm: FormGroup;
  passwordForm: FormGroup;
  
  activeTab: 'profile' | 'password' | 'settings' = 'profile';
  isLoading = false;
  isUpdatingProfile = false;
  isChangingPassword = false;
  isLoggingOut = false;
  
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  
  showToast = false;
  toastMessage = '';
  toastColor = 'success';

  currencyOptions = [
    { value: 'IDR', label: 'Indonesian Rupiah (IDR)', symbol: 'Rp' },
    { value: 'USD', label: 'US Dollar (USD)', symbol: '$' },
    { value: 'EUR', label: 'Euro (EUR)', symbol: '€' },
    { value: 'MYR', label: 'Malaysian Ringgit (MYR)', symbol: 'RM' },
    { value: 'SGD', label: 'Singapore Dollar (SGD)', symbol: 'S$' }
  ];

  languageOptions = [
    { value: 'id', label: 'Bahasa Indonesia' },
    { value: 'en', label: 'English' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      currency: ['IDR', Validators.required],
      language: ['id', Validators.required],
      monthlyBudget: [0, [Validators.min(0)]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Check if user is authenticated and fetch profile if needed
    if (this.authService.isAuthenticated && !this.authService.currentUserValue) {
      this.loadUserProfile();
    } else if (this.authService.currentUserValue) {
      this.currentUser = this.authService.currentUserValue;
      this.populateProfileForm(this.currentUser);
    }
    
    // Subscribe to user changes
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        if (user && user.name && user.email) {
          this.populateProfileForm(user);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  private populateProfileForm(user: User) {
    this.profileForm.patchValue({
      name: user?.name || '',
      email: user?.email || '',
      currency: user?.currency || 'IDR',
      language: user?.language || 'id',
      monthlyBudget: user?.monthlyBudget || 0
    });
  }

  async loadUserProfile() {
    this.isLoading = true;
    
    try {
      await this.authService.getProfile().toPromise();
    } catch (error: any) {
      this.showToastMessage('Gagal memuat profil: ' + error.message, 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async updateProfile() {
    if (this.profileForm.valid) {
      this.isUpdatingProfile = true;
      
      try {
        const profileData = {
          name: this.profileForm.value.name,
          currency: this.profileForm.value.currency,
          language: this.profileForm.value.language,
          monthlyBudget: this.profileForm.value.monthlyBudget
        };

        const response = await this.authService.updateProfile(profileData).toPromise();
        
        if (response?.success) {
          this.showToastMessage('Profil berhasil diperbarui!', 'success');
        }
        
      } catch (error: any) {
        const errorMessage = error?.message || 'Gagal memperbarui profil.';
        this.showToastMessage(errorMessage, 'danger');
      } finally {
        this.isUpdatingProfile = false;
      }
    } else {
      this.showToastMessage('Mohon lengkapi semua field yang diperlukan.', 'warning');
    }
  }

  async changePassword() {
    if (this.passwordForm.valid) {
      this.isChangingPassword = true;
      
      try {
        const passwordData = {
          currentPassword: this.passwordForm.value.currentPassword,
          newPassword: this.passwordForm.value.newPassword
        };

        const response = await this.authService.changePassword(passwordData).toPromise();
        
        if (response?.success) {
          this.showToastMessage('Password berhasil diubah!', 'success');
          this.passwordForm.reset();
        }
        
      } catch (error: any) {
        const errorMessage = error?.message || 'Gagal mengubah password.';
        this.showToastMessage(errorMessage, 'danger');
      } finally {
        this.isChangingPassword = false;
      }
    } else {
      if (this.passwordForm.errors?.['passwordMismatch']) {
        this.showToastMessage('Konfirmasi password tidak sesuai.', 'warning');
      } else {
        this.showToastMessage('Mohon lengkapi semua field yang diperlukan.', 'warning');
      }
    }
  }

  async logout() {
    this.isLoggingOut = true;
    
    try {
      await this.authService.logout().toPromise();
      this.showToastMessage('Logout berhasil!', 'success');
      
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
      
    } catch (error: any) {
      // Even if logout fails on server, we still navigate to login
      this.router.navigate(['/login']);
    } finally {
      this.isLoggingOut = false;
    }
  }

  setActiveTab(tab: 'profile' | 'password' | 'settings') {
    this.activeTab = tab;
  }

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm') {
    switch (field) {
      case 'current':
        this.showCurrentPassword = !this.showCurrentPassword;
        break;
      case 'new':
        this.showNewPassword = !this.showNewPassword;
        break;
      case 'confirm':
        this.showConfirmPassword = !this.showConfirmPassword;
        break;
    }
  }

  navigateBack() {
    this.router.navigate(['/dashboard']);
  }

  private showToastMessage(message: string, color: string) {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
  }

  // Getters for form controls
  get name() { return this.profileForm.get('name'); }
  get email() { return this.profileForm.get('email'); }
  get currency() { return this.profileForm.get('currency'); }
  get language() { return this.profileForm.get('language'); }
  get monthlyBudget() { return this.profileForm.get('monthlyBudget'); }
  
  get currentPassword() { return this.passwordForm.get('currentPassword'); }
  get newPassword() { return this.passwordForm.get('newPassword'); }
  get confirmPassword() { return this.passwordForm.get('confirmPassword'); }

  // Utility methods
  formatCurrency(amount: number): string {
    const selectedCurrency = this.currencyOptions.find(c => c.value === (this.currentUser?.currency || 'IDR'));
    const currencyAmount = amount || 0;
    return `${selectedCurrency?.symbol || 'Rp'}${currencyAmount.toLocaleString()}`;
  }

  getJoinDate(): string {
    if (this.currentUser?.createdAt) {
      try {
        return new Date(this.currentUser.createdAt).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (error) {
        return '';
      }
    }
    return '';
  }

  getLastLogin(): string {
    if (this.currentUser?.lastLogin) {
      try {
        return new Date(this.currentUser.lastLogin).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (error) {
        return '';
      }
    }
    return '';
  }
}