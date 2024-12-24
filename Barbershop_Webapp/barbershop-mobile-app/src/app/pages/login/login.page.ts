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

  public user!:string
  public password!:string

  constructor(private auth:AuthService, private router:Router, private home:HomeService) { }

  ngOnInit() {

    this.auth.auth().subscribe((response:HttpResponse<any>) => {
      if(response.ok){
        this.auth.isAuth = true;
        this.auth.name = response.body.client.name;
        this.auth.email = response.body.email;
        this.auth.phone = response.body.client.telephone;
        this.auth.isAuth = true;
        this.router.navigateByUrl('/home');
      }
    }, (error:HttpErrorResponse) => {
      //TODO - tratar erro
    })

  }

  login(user:string, password:string){
    
    this.auth.login(user, password).subscribe((response:HttpResponse<any>) => {
      if(response.ok){
        this.auth.isAuth = true;
        this.router.navigateByUrl('/home');
      }else{
        alert("Usuário ou senha inválidos");
      }
    })

  }

}
