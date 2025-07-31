import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonIcon, 
  IonToast,
  ToastController,
  AlertController,
  LoadingController, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBack,
  person,
  card,
  notifications,
  shield,
  moon,
  language,
  help,
  informationCircle,
  logOut,
  chevronForward,
  checkmark,
  close,
  settings,
  camera,
  mail,
  call,
  location,
  star,
  time,
  car,
  wallet,
  document as documentIcon,
  eye,
  eyeOff,
  lockClosed,
  fingerPrint,
  key,
  globe,
  chatbubble,
  bug,
  heart,
  share,
  refresh,
  trash,
  warning,
  sunny,
  contrast,
  volumeHigh,
  volumeOff,
  phonePortrait,
  desktop,
  colorPalette,
  map,
  business,
  school,
  medkit,
  storefront, checkmarkCircle, download } from 'ionicons/icons';
import { BottomNavbarComponent } from 'src/app/components/dashboard/nav-bottom/navbar-bottom.component';
import { Router } from '@angular/router';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  rating: number;
  totalOrders: number;
  isVerified: boolean;
  specializations: string[];
  workingHours: {
    start: string;
    end: string;
    workingDays: string[];
  };
  location: {
    address: string;
    city: string;
    province: string;
  };
}

interface NotificationSettings {
  newOrders: boolean;
  orderUpdates: boolean;
  payments: boolean;
  promotions: boolean;
  systemUpdates: boolean;
  sound: boolean;
  vibration: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

interface SecuritySettings {
  biometricLogin: boolean;
  pinLogin: boolean;
  autoLogout: boolean;
  autoLogoutTime: number; // minutes
  hideBalance: boolean;
  twoFactorAuth: boolean;
  loginAlerts: boolean;
}

interface AppPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'id' | 'en';
  currency: 'IDR' | 'USD';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  mapProvider: 'google' | 'openstreet';
  distanceUnit: 'km' | 'mile';
  autoAcceptRadius: number; // km
  showTips: boolean;
  hapticFeedback: boolean;
}

interface BusinessInfo {
  businessName: string;
  businessType: string;
  licenseNumber: string;
  taxId: string;
  businessAddress: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
  };
}

type SettingSection = 'profile' | 'notifications' | 'security' | 'preferences' | 'business' | 'help';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [IonToolbar, 
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonIcon,
    IonToast,
    BottomNavbarComponent
  ],
  templateUrl: './app-settings.page.html',
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
    
    .profile-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .setting-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }
    
    .setting-card:hover {
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      transform: translateY(-2px);
    }
    
    .fade-in {
      animation: fadeIn 0.3s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .slide-up {
      animation: slideUp 0.3s ease-out;
    }
    
    @keyframes slideUp {
      from { transform: translateY(100%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    .toggle-switch {
      position: relative;
      width: 50px;
      height: 24px;
      background-color: #e5e7eb;
      border-radius: 12px;
      transition: background-color 0.3s;
      cursor: pointer;
    }
    
    .toggle-switch.active {
      background-color: #3b82f6;
    }
    
    .toggle-slider {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: transform 0.3s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    
    .toggle-switch.active .toggle-slider {
      transform: translateX(26px);
    }
  `]
})
export class AppSettingsPage implements OnInit, OnDestroy {

  // User Data
  userProfile: UserProfile = {
    id: '12345',
    name: 'Budi Santoso',
    email: 'budi.santoso@email.com',
    phone: '+6281234567890',
    avatar: '',
    joinDate: '2023-03-15',
    rating: 4.8,
    totalOrders: 156,
    isVerified: true,
    specializations: ['Motor', 'Mobil', 'Service Berkala'],
    workingHours: {
      start: '08:00',
      end: '17:00',
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    },
    location: {
      address: 'Jl. Sudirman No. 123',
      city: 'Jakarta Pusat',
      province: 'DKI Jakarta'
    }
  };

  // Settings Data
  notificationSettings: NotificationSettings = {
    newOrders: true,
    orderUpdates: true,
    payments: true,
    promotions: false,
    systemUpdates: true,
    sound: true,
    vibration: true,
    emailNotifications: false,
    smsNotifications: true
  };

  securitySettings: SecuritySettings = {
    biometricLogin: true,
    pinLogin: false,
    autoLogout: true,
    autoLogoutTime: 15,
    hideBalance: false,
    twoFactorAuth: false,
    loginAlerts: true
  };

  appPreferences: AppPreferences = {
    theme: 'light',
    language: 'id',
    currency: 'IDR',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    mapProvider: 'google',
    distanceUnit: 'km',
    autoAcceptRadius: 5,
    showTips: true,
    hapticFeedback: true
  };

  businessInfo: BusinessInfo = {
    businessName: 'Bengkel Budi Motor',
    businessType: 'Perorangan',
    licenseNumber: 'NIB-1234567890',
    taxId: '12.345.678.9-012.000',
    businessAddress: 'Jl. Raya Motor No. 45, Jakarta Timur',
    emergencyContact: {
      name: 'Siti Santoso',
      phone: '+6281987654321',
      relationship: 'Istri'
    },
    bankAccount: {
      bankName: 'BCA',
      accountNumber: '1234567890',
      accountHolder: 'BUDI SANTOSO'
    }
  };

  // UI State
  showToast = false;
  toastMessage = '';
  isLoading = false;
  currentSection: SettingSection = 'profile';
  showModal = false;
  modalTitle = '';
  modalContent = '';
  
  // Form states
  isEditingProfile = false;
  isEditingBusiness = false;
  
  // Temporary edit data
  tempProfile: Partial<UserProfile> = {};
  tempBusiness: Partial<BusinessInfo> = {};

  // Options
  themeOptions = [
    { value: 'light', label: 'Terang', icon: 'sunny' },
    { value: 'dark', label: 'Gelap', icon: 'moon' },
    { value: 'auto', label: 'Otomatis', icon: 'contrast' }
  ];

  languageOptions = [
    { value: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
    { value: 'en', label: 'English', flag: '🇺🇸' }
  ];

  mapProviderOptions = [
    { value: 'google', label: 'Google Maps', icon: 'map' },
    { value: 'openstreet', label: 'OpenStreetMap', icon: 'globe' }
  ];

  specializationOptions = [
    { value: 'Motor', label: 'Motor', icon: 'car' },
    { value: 'Mobil', label: 'Mobil', icon: 'car' },
    { value: 'Truk', label: 'Truk', icon: 'car' },
    { value: 'Service Berkala', label: 'Service Berkala', icon: 'time' },
    { value: 'Perbaikan Darurat', label: 'Perbaikan Darurat', icon: 'warning' },
    { value: 'Ganti Spare Part', label: 'Ganti Spare Part', icon: 'settings' }
  ];

  businessTypeOptions = [
    { value: 'Perorangan', label: 'Perorangan' },
    { value: 'CV', label: 'CV (Commanditaire Vennootschap)' },
    { value: 'PT', label: 'PT (Perseroan Terbatas)' },
    { value: 'Koperasi', label: 'Koperasi' }
  ];

  workingDaysOptions = [
    { value: 'monday', label: 'Sen' },
    { value: 'tuesday', label: 'Sel' },
    { value: 'wednesday', label: 'Rab' },
    { value: 'thursday', label: 'Kam' },
    { value: 'friday', label: 'Jum' },
    { value: 'saturday', label: 'Sab' },
    { value: 'sunday', label: 'Min' }
  ];

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) {
    addIcons({arrowBack,person,checkmark,star,notifications,shield,settings,business,help,checkmarkCircle,key,chevronForward,download,trash,volumeHigh,phonePortrait,mail,chatbubble,refresh,bug,share,heart,logOut,close,document:documentIcon,card,moon,language,informationCircle,camera,call,location,time,car,wallet,eye,eyeOff,lockClosed,fingerPrint,globe,warning,sunny,contrast,volumeOff,desktop,colorPalette,map,school,medkit,storefront});
  }

  ngOnInit() {
    this.loadUserSettings();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  async loadUserSettings() {
    // Simulate loading user settings from API/storage
    // In real app: load from localStorage or API
    this.loadSettingsFromStorage();
  }

  private loadSettingsFromStorage() {
    // Load from localStorage if available
    const savedNotifications = localStorage.getItem('notificationSettings');
    if (savedNotifications) {
      this.notificationSettings = { ...this.notificationSettings, ...JSON.parse(savedNotifications) };
    }

    const savedSecurity = localStorage.getItem('securitySettings');
    if (savedSecurity) {
      this.securitySettings = { ...this.securitySettings, ...JSON.parse(savedSecurity) };
    }

    const savedPreferences = localStorage.getItem('appPreferences');
    if (savedPreferences) {
      this.appPreferences = { ...this.appPreferences, ...JSON.parse(savedPreferences) };
    }
  }

  private saveSettingsToStorage() {
    localStorage.setItem('notificationSettings', JSON.stringify(this.notificationSettings));
    localStorage.setItem('securitySettings', JSON.stringify(this.securitySettings));
    localStorage.setItem('appPreferences', JSON.stringify(this.appPreferences));
  }

  // Section Navigation
  setCurrentSection(section: SettingSection) {
    this.currentSection = section;
  }

  // Profile Management
  startEditProfile() {
    this.isEditingProfile = true;
    this.tempProfile = { ...this.userProfile };
  }

  cancelEditProfile() {
    this.isEditingProfile = false;
    this.tempProfile = {};
  }

  async saveProfile() {
    const loading = await this.loadingController.create({
      message: 'Menyimpan profil...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // Simulate API call
      await this.delay(2000);
      
      // Update profile
      this.userProfile = { ...this.userProfile, ...this.tempProfile };
      
      await loading.dismiss();
      this.isEditingProfile = false;
      this.tempProfile = {};
      
      this.showToastMessage('Profil berhasil diperbarui');
    } catch (error) {
      await loading.dismiss();
      this.showToastMessage('Gagal memperbarui profil');
    }
  }

  // Business Info Management
  startEditBusiness() {
    this.isEditingBusiness = true;
    this.tempBusiness = { ...this.businessInfo };
  }

  cancelEditBusiness() {
    this.isEditingBusiness = false;
    this.tempBusiness = {};
  }

  async saveBusiness() {
    const loading = await this.loadingController.create({
      message: 'Menyimpan info bisnis...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // Simulate API call
      await this.delay(2000);
      
      // Update business info
      this.businessInfo = { ...this.businessInfo, ...this.tempBusiness };
      
      await loading.dismiss();
      this.isEditingBusiness = false;
      this.tempBusiness = {};
      
      this.showToastMessage('Info bisnis berhasil diperbarui');
    } catch (error) {
      await loading.dismiss();
      this.showToastMessage('Gagal memperbarui info bisnis');
    }
  }

  // Notification Settings
  toggleNotification(key: keyof NotificationSettings) {
    this.notificationSettings[key] = !this.notificationSettings[key];
    this.saveSettingsToStorage();
    this.showToastMessage('Pengaturan notifikasi diperbarui');
  }

  // Security Settings
  toggleSecurity(key: keyof SecuritySettings) {
    if (key === 'biometricLogin' || key === 'twoFactorAuth') {
      this.handleSecurityToggle(key);
    } else if (key === 'autoLogoutTime') {
      // Handle numeric property separately - don't toggle
      return;
    } else {
      // Only toggle boolean properties
      (this.securitySettings[key] as boolean) = !(this.securitySettings[key] as boolean);
      this.saveSettingsToStorage();
      this.showToastMessage('Pengaturan keamanan diperbarui');
    }
  }

  private async handleSecurityToggle(key: 'biometricLogin' | 'twoFactorAuth') {
    if (!this.securitySettings[key]) {
      // Enabling security feature
      const alert = await this.alertController.create({
        header: 'Konfirmasi Keamanan',
        message: key === 'biometricLogin' 
          ? 'Aktifkan login dengan sidik jari/Face ID?' 
          : 'Aktifkan autentikasi dua faktor?',
        buttons: [
          {
            text: 'Batal',
            role: 'cancel'
          },
          {
            text: 'Aktifkan',
            handler: () => {
              this.securitySettings[key] = true;
              this.saveSettingsToStorage();
              this.showToastMessage('Fitur keamanan diaktifkan');
            }
          }
        ]
      });
      await alert.present();
    } else {
      // Disabling security feature
      this.securitySettings[key] = false;
      this.saveSettingsToStorage();
      this.showToastMessage('Fitur keamanan dinonaktifkan');
    }
  }

  // App Preferences
  updatePreference(key: keyof AppPreferences, value: any) {
    (this.appPreferences as any)[key] = value;
    this.saveSettingsToStorage();
    this.showToastMessage('Preferensi aplikasi diperbarui');
    
    // Apply theme immediately
    if (key === 'theme') {
      this.applyTheme(value);
    }
  }

  private applyTheme(theme: string) {
    // In real app: apply theme to document
    const themeClass = theme === 'dark' ? 'dark-theme' : 'light-theme';
    if (typeof document !== 'undefined' && document.body) {
      document.body.className = themeClass;
    }
  }

  // Specialization Management
  toggleSpecialization(specialization: string) {
    const index = this.userProfile.specializations.indexOf(specialization);
    if (index > -1) {
      this.userProfile.specializations.splice(index, 1);
    } else {
      this.userProfile.specializations.push(specialization);
    }
    this.showToastMessage('Spesialisasi diperbarui');
  }

  isSpecializationSelected(specialization: string): boolean {
    return this.userProfile.specializations.includes(specialization);
  }

  // Working Days Management
  toggleWorkingDay(day: string) {
    const index = this.userProfile.workingHours.workingDays.indexOf(day);
    if (index > -1) {
      this.userProfile.workingHours.workingDays.splice(index, 1);
    } else {
      this.userProfile.workingHours.workingDays.push(day);
    }
    this.showToastMessage('Hari kerja diperbarui');
  }

  isWorkingDaySelected(day: string): boolean {
    return this.userProfile.workingHours.workingDays.includes(day);
  }

  // Modal Management
  showModalContent(title: string, content: string) {
    this.modalTitle = title;
    this.modalContent = content;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.modalTitle = '';
    this.modalContent = '';
  }

  // Account Actions
  async changePassword() {
    const alert = await this.alertController.create({
      header: 'Ubah Password',
      inputs: [
        {
          name: 'currentPassword',
          type: 'password',
          placeholder: 'Password saat ini'
        },
        {
          name: 'newPassword',
          type: 'password',
          placeholder: 'Password baru'
        },
        {
          name: 'confirmPassword',
          type: 'password',
          placeholder: 'Konfirmasi password baru'
        }
      ],
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Simpan',
          handler: (data) => {
            if (data.newPassword !== data.confirmPassword) {
              this.showToastMessage('Password konfirmasi tidak cocok');
              return false;
            }
            this.showToastMessage('Password berhasil diubah');
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteAccount() {
    const alert = await this.alertController.create({
      header: 'Hapus Akun',
      message: 'Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Hapus',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.showToastMessage('Permintaan penghapusan akun dikirim');
          }
        }
      ]
    });
    await alert.present();
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Apakah Anda yakin ingin keluar dari aplikasi?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Logout',
          handler: () => {
            this.showToastMessage('Logout berhasil');
            // In real app: clear session and navigate to login
            this.router.navigate(['/masuk']);
          }
        }
      ]
    });
    await alert.present();
  }

  // Support Actions
  contactSupport() {
    this.showToastMessage('Menghubungi customer support...');
  }

  reportBug() {
    this.showToastMessage('Membuka form laporan bug...');
  }

  shareApp() {
    this.showToastMessage('Membagikan aplikasi...');
  }

  rateApp() {
    this.showToastMessage('Membuka Play Store untuk rating...');
  }

  // Data Management
  async clearCache() {
    const loading = await this.loadingController.create({
      message: 'Membersihkan cache...',
      spinner: 'crescent'
    });
    await loading.present();

    await this.delay(2000);
    await loading.dismiss();
    this.showToastMessage('Cache berhasil dibersihkan');
  }

  async exportData() {
    const loading = await this.loadingController.create({
      message: 'Mengekspor data...',
      spinner: 'crescent'
    });
    await loading.present();

    await this.delay(3000);
    await loading.dismiss();
    this.showToastMessage('Data berhasil diekspor');
  }

  // Utility Methods
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  formatJoinDate(): string {
    const date = new Date(this.userProfile.joinDate);
    return date.toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  getWorkingDaysLabel(): string {
    const dayLabels: { [key: string]: string } = {
      'monday': 'Sen',
      'tuesday': 'Sel',
      'wednesday': 'Rab',
      'thursday': 'Kam',
      'friday': 'Jum',
      'saturday': 'Sab',
      'sunday': 'Min'
    };
    
    return this.userProfile.workingHours.workingDays
      .map(day => dayLabels[day])
      .join(', ');
  }

  goBack() {
    this.showToastMessage('Kembali ke halaman sebelumnya');
  }

  private showToastMessage(message: string) {
    this.toastMessage = message;
    this.showToast = true;
  }
}