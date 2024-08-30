import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as ProgressBar from 'progressbar.js';
import { forkJoin, Observable } from 'rxjs';
import { BillService } from 'src/app/bill.service';
import { BookService } from 'src/app/book.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardPage implements OnInit {

  loading:boolean = true;
  changeLoading:boolean = false;
  viewToggle:boolean = false;
  toastColor:string = 'primary';
  toastMessage:string = '';
  isToastOpen:boolean = false;

  profitChart = 0
  dueChart = 0
  billChart = 0

  profitQt:number = 0;
  dueQt:number = 1000;
  billQt:number = 0;
  totalQt:number = 0;

  month:number = new Date().getMonth();
  year:number = new Date().getFullYear();

  bills:any = {
    value: 0,
    bill_type: {
      name: ''
    },
    day: 1,
    month: 1,
    year: 2024
  }
  books:any = {
    services:{
      price: 0
    },
    bookingDate: new Date(),
  }
  data:any;

  constructor(private bill:BillService, private book:BookService) { }

  ngOnInit() {

    var dueBar = new ProgressBar.Circle('#yellow-circle',{
      strokeWidth: 6,
      easing: 'easeInOut',
      duration: 1000,
      color: '#ffd256',
      trailColor: 'transparent',
      svgStyle: null
    })

    var profitBar = new ProgressBar.Circle('#blue-circle',{
      strokeWidth: 6,
      easing: 'easeInOut',
      duration: 1000,
      color: '#0aa0f7',
      trailColor: 'transparent',
      svgStyle: null
    })

    var billBar = new ProgressBar.Circle('#red-circle',{
      strokeWidth: 6,
      easing: 'easeInOut',
      duration: 1000,
      color: '#e72d2d',
      trailColor: 'transparent',
      svgStyle: null
    })

    forkJoin([this.bill.getBills(this.month + 1, this.year), this.book.getPeriodBookings(new Date(this.year, this.month, 1).toISOString(), new Date(this.year, this.month + 1, 0).toISOString())])
    .pipe()
    .subscribe((response: any) => {
      this.bills = response[0].body.map((bill:any) => ({
        ...bill,
          value: bill.value - bill.value*2,
          bookingDate: new Date(bill.year, bill.month - 1, bill.day).getTime(),
          type: bill.bill_type.name
      }))
      this.books = response[1].body.map((book:any) => ({
        ...book,
          value: book.services.price,
          type: book.services.name
      }))
      
      this.bills.forEach((bill:any) => {
        this.billQt += bill.value - bill.value*2;
      });
      this.books.forEach((book:any) => {
        this.profitQt += book.value;
      });

      if(this.profitQt < this.dueQt){
        this.totalQt = this.billQt + this.profitQt
        this.dueQt = 0;
      }else if(this.profitQt > this.billQt){
        this.dueQt = this.profitQt - this.billQt;
        if(this.dueQt >= 1000){
          this.dueQt = 1000
        }
        this.totalQt = this.billQt + this.dueQt + this.profitQt;
      }

      this.profitChart = this.profitQt / this.totalQt;
      this.dueChart = this.dueQt / this.totalQt;
      this.billChart = this.billQt / this.totalQt;
      
      this.data = [...this.bills, ...this.books];
      this.data.sort((a: any, b: any) => a.bookingDate - b.bookingDate);
      this.loading = false;
      this.animateBars(billBar, dueBar, profitBar);
    })

  }

  animateBars(billBar: any, dueBar: any, profitBar: any) {
    billBar.animate(this.billChart);
    dueBar.animate(this.dueChart + this.billChart);
    profitBar.animate(this.profitChart + this.dueChart + this.billChart);
  }

}
