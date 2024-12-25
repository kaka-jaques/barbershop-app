import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http:HttpClient) { }

  getTodayBookings(id:number): Observable<HttpResponse<any>> {
    return this.http.get<any>('http://localhost:8080/book/today/'+id, { observe: 'response' });
  }

  getTodayBookingsWOBarber(): Observable<HttpResponse<any>> {
    return this.http.get<any>('http://localhost:8080/book/today/0', { observe: 'response' });
  }

  getPeriodBookings(startDate: string, endDate: string, id:number): Observable<HttpResponse<any>> {
    return this.http.post<any>('http://localhost:8080/book/period/'+id, {startDate: startDate, endDate: endDate},{ observe: 'response' });
  }

  getPeriodBookingsWOBarber(startDate: string, endDate: string): Observable<HttpResponse<any>> {
    return this.http.post<any>('http://localhost:8080/book/period/0', {startDate: startDate, endDate: endDate},{ observe: 'response' });
  }

  createBook(book: any, auth:boolean): Observable<HttpResponse<any>> {
    return this.http.post<any>('http://localhost:8080/book', book, { observe: 'response', headers: {'Auth': auth.toString()}});
  }

  updateBook(book: any): Observable<HttpResponse<any>> {
    return this.http.put<any>('http://localhost:8080/book', book, { observe: 'response' });
  }

  deleteBook(bookId: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>('http://localhost:8080/book/' + bookId, { observe: 'response' });
  }

}
