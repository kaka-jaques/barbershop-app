import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  expiredBills:number = 0;

  constructor(private http:HttpClient) { }

  getBills(month:number, year:number): Observable<HttpResponse<any>> {
    return this.http.get<any>('http://localhost:8080/bill/'+month+'/'+year, { observe: 'response' });
  }

  getBillTypes(): Observable<HttpResponse<any>> {
    return this.http.get<any>('http://localhost:8080/bill/type', { observe: 'response' });
  }

  createBill(bill:any): Observable<HttpResponse<any>> {
    return this.http.post<any>('http://localhost:8080/bill', bill, { observe: 'response' });
  }

  deleteBill(billId:number): Observable<HttpResponse<any>> {
    return this.http.delete<any>('http://localhost:8080/bill/'+billId, { observe: 'response' });
  }

  updateBill(bill:any): Observable<HttpResponse<any>> {
    return this.http.put<any>('http://localhost:8080/bill', bill, { observe: 'response' });
  }

}
