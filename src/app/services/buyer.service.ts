import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BuyerProfile {
  _id: string;
  role: string;
  nama: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BuyerProfileResponse {
  success: boolean;
  data: BuyerProfile;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BuyerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('kaskita_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Get buyer profile
  getBuyerProfile(): Observable<BuyerProfileResponse> {
    return this.http.get<BuyerProfileResponse>(`${this.apiUrl}/buyer/profile`, {
      headers: this.getHeaders()
    });
  }

  // Update buyer profile
  updateBuyerProfile(data: { nama: string }): Observable<BuyerProfileResponse> {
    return this.http.put<BuyerProfileResponse>(`${this.apiUrl}/buyer/profile`, data, {
      headers: this.getHeaders()
    });
  }
}
