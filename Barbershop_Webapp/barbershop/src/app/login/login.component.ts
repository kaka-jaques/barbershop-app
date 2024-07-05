import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { gsap } from 'gsap/gsap-core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  public user!:string;
  public password!:string;

  constructor(private authService: AuthService, private router: Router) { }

  login(user:string, password:string) {
    this.authService.login(user, password);
    gsap.to('main',{
      duration: 0,
      paddingLeft: '21%',
      paddingTop: '21%'
    })
    this.router.navigateByUrl('/home');
  }

}
