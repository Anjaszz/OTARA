import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: 'on-boarding.page.html',
  styleUrls: []
})
export class OnBoardingPage implements OnInit {
  
  constructor(private router: Router,private storageService: StorageService){}

  currentSlide = 0;
  slides = [
    {
      title: 'Selamat Datang di AutoPartner',
      subtitle: 'Platform terpercaya untuk ahli otomotif'
    },
    {
      title: 'Keuntungan Bergabung',
      subtitle: 'Dapatkan berbagai keuntungan eksklusif'
    },
    {
      title: 'Cara Kerja Mudah',
      subtitle: 'Hanya 3 langkah untuk mulai'
    }
  ];

  dots = new Array(3);



  ngOnInit() {
    console.log('Onboarding initialized');
  }

  nextSlide() {
    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    } else {
      this.finish();
    }
  }

  previousSlide() {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  getDotClass(index: number): string {
    return index === this.currentSlide 
      ? 'bg-blue-600 w-6' 
      : 'bg-gray-300 w-2';
  }

  skip() {
    this.finish();
  }

  finish() {
    this.storageService.setFirstTimeUser(false); // Set bahwa user sudah melewati onboarding
    this.router.navigate(['/daftar']);
  }
  
}