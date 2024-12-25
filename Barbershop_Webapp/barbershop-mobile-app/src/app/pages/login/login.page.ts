import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public user!: string
  public password!: string

  toastColor: string = 'primary';
  toastMessage: string = '';
  isToastOpen: boolean = false;
  logging:boolean = false;

  constructor(private auth: AuthService, private router: Router, private home: HomeService) { }

  ngOnInit() {

    this.logging = true;

    this.auth.auth().subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.logging = false;
        this.auth.name = response.body.client.name;
        this.auth.email = response.body.email;
        this.auth.phone = response.body.client.telephone;
        this.auth.id = response.body.id;
        this.auth.role = response.body.role[0].id;
        if (this.auth.role != 3) {
          this.auth.isAuth = true;
          this.router.navigateByUrl('/home');
        }else{
          this.logging = false;
          this.toastColor = 'danger';
          this.toastMessage = 'Usuário não autorizado!';
          this.isToastOpen = true;
        }
      }
    }, (error) => {
      this.logging = false;
      if (error.status == 401) {
        this.toastColor = 'primary';
        this.toastMessage = 'Token expirado! Por favor, faço o login novamente.';
        this.isToastOpen = true;
      } else {
        this.toastColor = 'danger';
        this.toastMessage = 'Erro ao logar: ' + error.error.message;
        this.isToastOpen = true;
      }
    })

  }

  login(user: string, password: string) {

    this.logging = true;
    
    this.auth.login(user, password).subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.ngOnInit();
      }
    }, (error) => {
      this.logging = false;
      if (error.status == 401) {
        this.toastColor = 'danger';
        this.toastMessage = 'Usuário ou senha incorretos!';
        this.isToastOpen = true;
      } else {
        this.toastColor = 'danger';
        this.toastMessage = 'Erro ao logar: ' + error.error.message;
        this.isToastOpen = true;
      }
    })

  }

}
