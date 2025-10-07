import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IconModule } from 'src/app/components/icon/icon.module';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.page.html',
  styleUrls: ['./about-me.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, CommonModule,IconModule,RouterLink]
})
export class AboutMePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
