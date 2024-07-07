import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private readonly url:string = 'http://localhost:8080/';

  private name!:string;
  private user!:string;
  private email!:string;
  private phone!:string;
  private birthdate!:Date;
  private cpf!:string;
  private image_url!:string;

  constructor(private http:HttpClient) { }

  getUserData():any{
    return {
      user: this.user, 
      name: this.name, 
      email: this.email, 
      phone: this.phone, 
      birthdate: this.birthdate, 
      cpf: this.cpf, 
      image_url: this.image_url
    };
  }

  setUserData(data:any){
    this.user = data.user;
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.birthdate = data.birthdate;
    this.cpf = data.cpf;
    this.image_url = data.image_url;
  }

  getNotifications():any{
    return {
      serviceToday: 6,
      billExpired: 5,
      billPending: 4,
      birthsToday: 3,
      birthsMonth: 20
    }
  }

  getNotificationsConfig():Observable<HttpResponse<any>>{
    return this.http.get(this.url + 'notify', {observe: 'response'});
  }

}
