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

  getTempClients(): Observable<HttpResponse<any>> {
    return this.http.get<any>('http://localhost:8080/users/temp', {observe: 'response'});
  }

  updateUser(user:any): Observable<HttpResponse<any>> {
    return this.http.put<any>('http://localhost:8080/auth/update', user, {observe: 'response'});
  }

  deleteUser(user:any): Observable<HttpResponse<any>> {
    return this.http.delete<any>('http://localhost:8080/users/' + user.id, {observe: 'response'});
  }

  deleteClient(client:any): Observable<HttpResponse<any>> {
    return this.http.delete<any>('http://localhost:8080/users/temp/' + client.id, {observe: 'response'});
  }

}
