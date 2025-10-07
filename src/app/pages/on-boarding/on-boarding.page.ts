import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, IonicModule,RouterLink],
  templateUrl: 'on-boarding.page.html',
  styleUrls: []
})
export class OnBoardingPage {
  
  constructor(private router: Router,private storageService: StorageService){}

  


  
}