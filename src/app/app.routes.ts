import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'daftar',
    loadComponent: () => import('./pages/register/register.page').then( m => m.RegisterPage)
  },
  {
    path: 'masuk',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then( m => m.DashboardPage)
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
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.page').then( m => m.SplashPage)
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


];
