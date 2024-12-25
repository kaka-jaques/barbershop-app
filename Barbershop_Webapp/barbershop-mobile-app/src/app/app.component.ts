import { Component} from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { MenuController } from '@ionic/angular';

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
    { title: 'Usuários', url: '/users', icon: 'people' },
    { title: 'Configurações', url: '/config', icon: 'construct' },
  ];

  name: string = '';
  logouting: boolean = false;

  toastColor: string = 'primary';
  toastMessage: string = '';
  isToastOpen: boolean = false;

  constructor(public auth: AuthService, private router: Router, private menuCtrl:MenuController) { }

  async logout() {
    this.logouting = true
    this.auth.logout().subscribe((response:HttpResponse<any>) => {
      if (response.ok) {
        this.auth.isAuth = false;
        this.logouting = false
        this.menuCtrl.close();
        this.router.navigateByUrl('');
      }
    }, (error)=>{
      this.logouting = false
      this.toastColor = 'danger';
      this.toastMessage = 'Erro ao deslogar!';
      this.isToastOpen = true;
    });
  }

}
