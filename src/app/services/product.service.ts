import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SellerInfo {
  _id: string;
  namaToko: string;
  fotoProfil: string;
  domisili: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  alamatUsaha?: string;
}

export interface Product {
  _id: string;
  sellerId: string | SellerInfo;
  nama: string;
  deskripsi: string;
  harga: number;
  kategori: string;
  foto: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductResponse {
  success: boolean;
  count?: number;
  total?: number;
  page?: number;
  pages?: number;
  data?: Product[] | Product;
  message?: string;
}

export interface ProductListParams {
  search?: string;
  kategori?: string;
  sortBy?: 'terbaru' | 'termurah' | 'termahal';
  page?: number;
  limit?: number;
}

export interface Category {
  _id: string;
  nama: string;
  slug: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  success: boolean;
  count: number;
  data: Category[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('kaskita_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all seller products
  getSellerProducts(): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/seller/products`, {
      headers: this.getHeaders()
    });
  }

  // Add new product
  addProduct(formData: FormData): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.apiUrl}/products`, formData, {
      headers: this.getHeaders()
    });
  }

  // Update product
  updateProduct(id: string, formData: FormData): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.apiUrl}/products/${id}`, formData, {
      headers: this.getHeaders()
    });
  }

  // Delete product
  deleteProduct(id: string): Observable<ProductResponse> {
    return this.http.delete<ProductResponse>(`${this.apiUrl}/products/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Get all categories
  getCategories(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiUrl}/categories`);
  }

  // Get all products with optional filters
  getProducts(params?: ProductListParams): Observable<ProductResponse> {
    let queryString = '';

    if (params) {
      const queryParams: string[] = [];
      if (params.search) queryParams.push(`search=${encodeURIComponent(params.search)}`);
      if (params.kategori) queryParams.push(`kategori=${encodeURIComponent(params.kategori)}`);
      if (params.sortBy) queryParams.push(`sortBy=${params.sortBy}`);
      if (params.page) queryParams.push(`page=${params.page}`);
      if (params.limit) queryParams.push(`limit=${params.limit}`);

      if (queryParams.length > 0) {
        queryString = '?' + queryParams.join('&');
      }
    }

    return this.http.get<ProductResponse>(`${this.apiUrl}/products${queryString}`);
  }

  // Get product by ID (public)
  getProductById(id: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/products/${id}`);
  }
}
