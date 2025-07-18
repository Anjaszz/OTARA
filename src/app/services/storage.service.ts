// src/app/services/storage.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  setFirstTimeUser(isFirstTime: boolean) {
    localStorage.setItem('isFirstTime', JSON.stringify(isFirstTime));
  }
  
  isFirstTimeUser(): boolean {
    const isFirstTime = localStorage.getItem('isFirstTime');
    return isFirstTime === null || JSON.parse(isFirstTime) === true;
  }
}