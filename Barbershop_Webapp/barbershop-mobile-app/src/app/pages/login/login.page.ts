import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public user!:string
  public password!:string

  constructor(private auth:AuthService, private router:Router) { }

  ngOnInit() {
    this.auth.auth();

    if(this.auth.isAuth){
      this.router.navigateByUrl('/home');
    }

  }

  login(user:string, password:string){
    this.auth.login(user, password);
  }

}
