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

  }

  login(){

  }

  logout(){

  }

  getToken():string{
    return this.token;
  }

}
