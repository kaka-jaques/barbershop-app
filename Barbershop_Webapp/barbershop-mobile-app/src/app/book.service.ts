import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http:HttpClient) { }

  getTodayBookings(): Observable<HttpResponse<any>> {
    return this.http.get<any>('http://localhost:8080/book/today', { observe: 'response' });
  }

}
