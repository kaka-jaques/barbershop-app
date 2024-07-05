import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { gsap } from 'gsap/gsap-core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly url:string = 'http://localhost:8080/';

  private userName!:string;
  private userPermissions!:string[];
  private userToken!:string;
  public isAuthenticated:boolean = false;

  constructor(private http:HttpClient) { }

  login(username:string, password:string){
    this.isAuthenticated = true;
  }

  logout(){
    this.isAuthenticated = false;
    gsap.to('main',{
      duration: 0,
      padding: 0
    })
  }

}
