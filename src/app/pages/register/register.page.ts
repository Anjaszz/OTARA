import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IconModule } from 'src/app/components/icon/icon.module';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule,IconModule],
  templateUrl: 'register.page.html',
  styleUrls: []
})
export class RegisterPage implements OnInit {
  
  formData = {
    nama: '',
    email: '',
    nomorTelepon: '',
    jenisKelamin: '',
    kataSandi: '',
    nomorKTP: '',
    alamatLengkap: '',
    domisili: '',
    namaPemilikRekening: '',
    namaBank: '',
    nomorRekening: '',
    setujuSyarat: false
  };

  showPassword = false;
  profileImage: string | null = null;

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    console.log('Register page initialized');
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  isFormValid(): boolean {
    return this.formData.nama.trim() !== '' &&
           this.formData.email.trim() !== '' &&
           this.formData.nomorTelepon.trim() !== '' &&
           this.formData.jenisKelamin !== '' &&
           this.formData.kataSandi.trim() !== '' &&
           this.formData.nomorKTP.trim() !== '' &&
           this.formData.alamatLengkap.trim() !== '' &&
           this.formData.domisili !== '' &&
           this.formData.namaPemilikRekening.trim() !== '' &&
           this.formData.namaBank !== '' &&
           this.formData.nomorRekening.trim() !== '' &&
           this.formData.setujuSyarat;
  }

  onSubmit() {
    if (this.isFormValid()) {
      console.log('Form submitted:', this.formData);
      
      // Set bahwa user sudah daftar (tidak first time lagi)
      this.storageService.setFirstTimeUser(false);
      
      // Handle form submission here
      alert('Pendaftaran berhasil! Data akan diproses.');
    }
  }

  goBack() {
    // Handle back navigation
    console.log('Back button clicked');
  }
}