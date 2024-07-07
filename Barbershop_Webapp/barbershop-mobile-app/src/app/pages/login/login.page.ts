import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
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

    if(this.auth.auth()){
      this.router.navigateByUrl('/home');
    }

  }

  login(user:string, password:string){
    
    this.auth.login(user, password).subscribe((response:HttpResponse<any>) => {
      if(response.ok){
        this.auth.isAuth = true;
        // this.home.setUserData({
        //   user: response.body.user, 
        //   name: response.body.client.name,
        //   email: response.body.email,
        //   phone: response.body.client.telephone,
        //   image_url: response.body.client.image_url,
        //   birthdate: response.body.client.birthDate,
        //   cpf: response.body.client.cpf
        // });
        this.router.navigateByUrl('/home');
      }else{
        alert("Usuário ou senha inválidos");
      }
    })

  }

}
