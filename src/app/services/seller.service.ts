import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SellerProfile {
  _id: string;
  role: string;
  namaToko: string;
  email: string;
  fotoProfil: string;
  domisili: string;
  jenisUsaha: string;
  nomorIzinUsaha: string;
  alamatUsaha: string;
  whatsapp: string;
  facebook?: string;
  instagram?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SellerProfileResponse {
  success: boolean;
  data: SellerProfile;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('kaskita_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Get seller profile (authenticated)
  getSellerProfile(): Observable<SellerProfileResponse> {
    return this.http.get<SellerProfileResponse>(`${this.apiUrl}/seller/profile`, {
      headers: this.getHeaders()
    });
  }

  // Get public seller profile by ID (public endpoint)
  getPublicSellerProfile(sellerId: string): Observable<SellerProfileResponse> {
    return this.http.get<SellerProfileResponse>(`${this.apiUrl}/seller/${sellerId}/profile`);
  }

  // Get seller products (public endpoint)
  getSellerProducts(sellerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/seller/${sellerId}/products`);
  }

  // Update seller profile
  updateSellerProfile(formData: FormData): Observable<SellerProfileResponse> {
    const token = localStorage.getItem('kaskita_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // Don't set Content-Type for FormData, browser will set it automatically with boundary
    });

    return this.http.put<SellerProfileResponse>(`${this.apiUrl}/seller/profile`, formData, {
      headers: headers
    });
  }
}
