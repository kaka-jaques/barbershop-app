import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly url:string = 'http://localhost:8080/'

  public isAuth:boolean = false;
  private token!:string;

  constructor(private http:HttpClient) { }

  auth(){
    this.isAuth = true;
  }

  login(user:string, password:string){
    this.isAuth = true;
  }

  logout(){
    this.isAuth = false;
  }

  getToken():string{
    return this.token;
  }

}
