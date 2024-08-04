import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  path!:string;
  pathTitles:any = {
    '/home': 'Home',
    '/book': 'Agendamentos',
    '/dashboard': 'Dashboard',
    '/bill': 'Financeiro',
    '/users': 'Usuários',
    '/config': 'Configurações',
    '/services': 'Serviços'
  }

  constructor() { }

  ngOnInit() {
    this.path = this.pathTitles[window.location.pathname]
  }

}
