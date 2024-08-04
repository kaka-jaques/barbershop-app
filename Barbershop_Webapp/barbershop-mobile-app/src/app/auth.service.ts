import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly url:string = 'http://localhost:8080/'

  public isAuth:boolean = false;
  private token!:string;

  public name:string = '';
  public email:string = '';
  public phone:string = '';

  constructor(private http:HttpClient) { }

  auth():Observable<HttpResponse<any>>{
      return this.http.get<any>(this.url + 'auth', {observe: 'response'});
  }

  login(user:string, password:string):Observable<HttpResponse<any>>{
    return this.http.post<any>(this.url + 'auth/login', {user: user, password: password}, {observe: 'response', headers: {'keep': 'true'}});
  }

  logout(){
    this.http.get(this.url + 'auth/logout', {observe: 'response'}).subscribe();
    this.isAuth = false;
    
  }

  getToken():string{
    return this.token;
  }

}
