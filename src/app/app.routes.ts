import { Routes } from '@angular/router';
import { buyerGuard } from './guards/buyer.guard';
import { sellerGuard } from './guards/seller.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'on-boarding',
    pathMatch: 'full',
  },
  {
    path: 'daftar-penjual',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'daftar-pengguna',
    loadComponent: () => import('./pages/register-user/register-user.page').then( m => m.RegisterUserPage)
  },
  {
    path: 'masuk',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then( m => m.DashboardPage),
    canActivate: [buyerGuard]
  },
  {
    path: 'buyer/profile',
    loadComponent: () => import('./pages/buyer/buyer-profile/buyer-profile.page').then( m => m.BuyerProfilePage),
    canActivate: [buyerGuard]
  },
  {
    path: 'categories',
    loadComponent: () => import('./pages/categories/categories.page').then( m => m.CategoriesPage),
    canActivate: [buyerGuard]
  },
  // {
  //   path: 'add-transaction',
  //   loadComponent: () => import('./pages/add-transaction/add-transaction.page').then( m => m.AddTransactionPage)
  // },
  // {
  //   path: 'profile',
  //   loadComponent: () => import('./pages/profile/profile.page').then( m => m.ProfilePage)
  // },
  {
    path: 'on-boarding',
    loadComponent: () => import('./pages/on-boarding/on-boarding.page').then( m => m.OnBoardingPage)
  },
  {
    path: 'history-order',
    loadComponent: () => import('./pages/history-order/history-order.page').then( m => m.HistoryOrderPage)
  },
  {
    path: 'wallet-balance',
    loadComponent: () => import('./pages/wallet-balance/wallet-balance.page').then( m => m.WalletBalancePage)
  },
  {
    path: 'menu',
    loadComponent: () => import('./pages/app-settings/app-settings.page').then( m => m.AppSettingsPage)
  },
  {
    path: 'seller/home',
    loadComponent: () => import('./pages/seller/seller-home/seller-home.page').then( m => m.SellerHomePage),
    canActivate: [sellerGuard]
  },
  {
    path: 'seller/add-product',
    loadComponent: () => import('./pages/seller/add-product/add-product.page').then( m => m.AddProductPage),
    canActivate: [sellerGuard]
  },
  {
    path: 'seller/profile',
    loadComponent: () => import('./pages/seller/seller-profile/seller-profile.page').then( m => m.SellerProfilePage),
    canActivate: [sellerGuard]
  },
  {
    path: 'seller/edit-product/:id',
    loadComponent: () => import('./pages/seller/edit-product/edit-product.page').then( m => m.EditProductPage),
    canActivate: [sellerGuard]
  },
  {
    path: 'about-me',
    loadComponent: () => import('./pages/about-me/about-me.page').then( m => m.AboutMePage)
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.page').then( m => m.ProductsPage)
  },
  {
    path: 'product-detail/:id',
    loadComponent: () => import('./pages/product-detail/product-detail.page').then( m => m.ProductDetailPage)
  },
  {
    path: 'seller-public-profile/:sellerId',
    loadComponent: () => import('./pages/seller-public-profile/seller-public-profile.page').then( m => m.SellerPublicProfilePage)
  },
  {
    path: 'article-detail/:id',
    loadComponent: () => import('./pages/article-detail/article-detail.page').then( m => m.ArticleDetailPage)
  },
  {
    path: 'edit-profile',
    loadComponent: () => import('./pages/buyer/edit-profile/edit-profile.page').then( m => m.EditProfilePage)
  },
  {
    path: 'edit-seller-profile',
    loadComponent: () => import('./pages/seller/edit-seller-profile/edit-seller-profile.page').then( m => m.EditSellerProfilePage)
  },
  {
    path: 'detail-product-seller/:id',
    loadComponent: () => import('./pages/seller/detail-product-seller/detail-product-seller.page').then( m => m.DetailProductSellerPage)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  },
  {
    path: 'verify-otp',
    loadComponent: () => import('./pages/verify-otp/verify-otp.page').then( m => m.VerifyOtpPage)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password/reset-password.page').then( m => m.ResetPasswordPage)
  },


];
