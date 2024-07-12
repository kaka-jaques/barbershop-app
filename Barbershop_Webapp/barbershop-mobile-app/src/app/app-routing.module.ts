import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'book',
    loadChildren: () => import('./pages/book/book.module').then( m => m.BookPageModule)
  },
  {
    path: 'bill',
    loadChildren: () => import('./pages/bill/bill.module').then( m => m.BillPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'config',
    loadChildren: () => import('./pages/config/config.module').then( m => m.ConfigPageModule)
  },
  {
    path: 'app-config',
    loadChildren: () => import('./pages/app-config/app-config.module').then( m => m.AppConfigPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
