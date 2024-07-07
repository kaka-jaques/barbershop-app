import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Dashboard', url: '/dashboard', icon: 'stats-chart' },
    { title: 'Financeiro', url: '/bill', icon: 'cash' },
    { title: 'Agendamentos', url: '/book', icon: 'book' },
    { title: 'Usuários', url: '/users', icon: 'people' }
  ];
  constructor(public auth:AuthService) {}

}
