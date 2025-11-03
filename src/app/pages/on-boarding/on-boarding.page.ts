import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { IonContent, IonHeader, IonToolbar } from "@ionic/angular/standalone";

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, RouterLink, IonContent, IonHeader, IonToolbar],
  templateUrl: 'on-boarding.page.html',
  styleUrls: []
})
export class OnBoardingPage {
  
  constructor(private router: Router,private storageService: StorageService){}

  


  
}