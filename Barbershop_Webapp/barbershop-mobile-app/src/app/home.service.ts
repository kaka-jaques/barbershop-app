import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private readonly url:string = 'http://localhost:8080/';

  public notificationConfig!:any;

  public user: any;

  constructor(private http:HttpClient) { }

  getUserData():any{
    return {
      user: this.user,
    };
  }

  setUserData(data:any){
    this.user = data;
  }

  getNotifications():any{
    return this.http.get(this.url + 'notify/get', {observe: 'response'});
  }

  getNotificationsConfig():Observable<HttpResponse<any>>{
    return this.http.get(this.url + 'notify', {observe: 'response'});
  }

  setNotificationsConfig(data:any):Observable<HttpResponse<any>>{
    return this.http.put(this.url + 'notify', data, {observe: 'response'});
  }

}
