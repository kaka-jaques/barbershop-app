import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http:HttpClient) { }

  getAllUsers(): Observable<HttpResponse<any>> {
    return this.http.get<any>('http://localhost:8080/users', {observe: 'response'});
  }

}
