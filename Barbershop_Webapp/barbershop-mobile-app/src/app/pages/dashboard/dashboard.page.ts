import { Component, OnInit, ViewEncapsulation, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import * as ProgressBar from 'progressbar.js';
import { forkJoin } from 'rxjs';
import { BillService } from 'src/app/bill.service';
import { BookService } from 'src/app/book.service';
import { ConfigService } from 'src/app/config.service';
import { register, SwiperContainer } from 'swiper/element/bundle';
import { Swiper } from 'swiper/types';

register(); 

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DashboardPage implements OnInit {

  loading: boolean = true;
  changeLoading: boolean = false;
  viewToggle: boolean = false;
  toastColor: string = 'primary';
  toastMessage: string = '';
  isToastOpen: boolean = false;
  sliderPosition: number = 0;

  profitChart = 0
  dueChart = 0
  billChart = 0

  profitBar: any;
  dueBar: any;
  billBar: any;

  profitQt: number = 0;
  dueQt: number = 1000;
  billQt: number = 0;
  totalQt: number = 0;

  month: number = new Date().getMonth();
  year: number = new Date().getFullYear();

  bills: any = {
    value: 0,
    bill_type: {
      name: ''
    },
    day: 1,
    month: 1,
    year: 2024
  }
  books: any = {
    services: {
      price: 0
    },
    bookingDate: new Date(),
  }
  data: any;
  services: any = [];

  months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ]
  slidesName = [
    'Financeiro',
    'Serviços',
    'Slide 3'
  ]

  constructor(private bill: BillService, private book: BookService, private config:ConfigService) { }

  ngOnInit() {

    var dueBar = new ProgressBar.Circle('#yellow-circle', {
      strokeWidth: 6,
      easing: 'easeInOut',
      duration: 1000,
      color: '#ffd256',
      trailColor: 'transparent',
      svgStyle: null
    })

    var profitBar = new ProgressBar.Circle('#blue-circle', {
      strokeWidth: 6,
      easing: 'easeInOut',
      duration: 1000,
      color: '#0aa0f7',
      trailColor: 'transparent',
      svgStyle: null
    })

    var billBar = new ProgressBar.Circle('#red-circle', {
      strokeWidth: 6,
      easing: 'easeInOut',
      duration: 1000,
      color: '#e72d2d',
      trailColor: 'transparent',
      svgStyle: null
    })

    this.profitBar = profitBar;
    this.dueBar = dueBar;
    this.billBar = billBar;

    forkJoin([this.bill.getBills(this.month + 1, this.year), this.book.getPeriodBookings(new Date(this.year, this.month, 1).toISOString(), new Date(this.year, this.month + 1, 0).toISOString()), this.config.getServices()])
      .pipe()
      .subscribe((response: any) => {
        this.bills = response[0].body.map((bill: any) => ({
          ...bill,
          value: bill.value - bill.value * 2,
          bookingDate: new Date(bill.year, bill.month - 1, bill.day).getTime(),
          type: bill.bill_type.name
        }))
        this.books = response[1].body.map((book: any) => ({
          ...book,
          value: book.services.price,
          type: book.services.name
        }))
        this.services = response[2].body;

        this.bills.forEach((bill: any) => {
          this.billQt += bill.value - bill.value * 2;
        });
        this.books.forEach((book: any) => {
          this.profitQt += book.value;
        });

        if (this.profitQt < this.dueQt) {
          this.totalQt = this.billQt + this.profitQt
          this.dueQt = 0;
        } else if (this.profitQt > this.billQt) {
          this.dueQt = this.profitQt - this.billQt;
          if (this.dueQt >= 1000) {
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
    this.changeLoading = false;
  }

  nextSlide(swiper:SwiperContainer){
    swiper.swiper.slideNext();
  }

  backSlide(swiper:SwiperContainer){
    swiper.swiper.slidePrev();
  }

  prevMonth(){
    this.changeLoading = true;
    this.month--;
    if(this.month < 0){
      this.month = 11;
      this.year--;
    }
    this.getPeriodData();
  }

  nextMonth(){
    this.changeLoading = true;
    this.month++;
    if(this.month > 11){
      this.month = 0;
      this.year++;
    }
    this.getPeriodData();
  }

  getPeriodData(){

    this.billQt = 0;
    this.profitQt = 0;
    this.profitChart = 0;
    this.dueChart = 0;
    this.billChart = 0;
    this.totalQt = 0;

    const bars = [this.dueBar, this.billBar, this.profitBar];
    const resetBars = bars.map((bar: any) => this.resetBarsProgress(bar));

    forkJoin([this.bill.getBills(this.month + 1, this.year), this.book.getPeriodBookings(new Date(this.year, this.month, 1).toISOString(), new Date(this.year, this.month + 1, 0).toISOString()), ...resetBars])
      .pipe()
      .subscribe((response: any) => {
        this.bills = response[0].body.map((bill: any) => ({
          ...bill,
          value: bill.value - bill.value * 2,
          bookingDate: new Date(bill.year, bill.month - 1, bill.day).getTime(),
          type: bill.bill_type.name
        }))
        this.books = response[1].body.map((book: any) => ({
          ...book,
          value: book.services.price,
          type: book.services.name
        }))

        this.bills.forEach((bill: any) => {
          this.billQt += bill.value - bill.value * 2;
        });
        this.books.forEach((book: any) => {
          this.profitQt += book.value;
        });

        if (this.profitQt < this.dueQt) {
          this.totalQt = this.billQt + this.profitQt
          this.dueQt = 0;
        } else if (this.profitQt > this.billQt) {
          this.dueQt = this.profitQt - this.billQt;
          if (this.dueQt >= 1000) {
            this.dueQt = 1000
          }
          this.totalQt = this.billQt + this.dueQt + this.profitQt;
        }

        if (this.totalQt > 0 && !isNaN(this.totalQt)) {
          this.profitChart = this.profitQt / this.totalQt;
          this.dueChart = this.dueQt / this.totalQt;
          this.billChart = this.billQt / this.totalQt;
      } else if(this.totalQt < 0) {
        this.totalQt = this.totalQt * -1
        this.profitChart = this.profitQt / this.totalQt;
        this.dueChart = this.dueQt / this.totalQt;
        this.billChart = this.billQt / this.totalQt;
      }else{
        this.totalQt = this.profitQt + this.dueQt + this.billQt
        this.profitChart = this.profitQt / this.totalQt;
        this.dueChart = this.dueQt / this.totalQt;
        this.billChart = this.billQt / this.totalQt;
      }

        this.data = [...this.bills, ...this.books];
        this.data.sort((a: any, b: any) => a.bookingDate - b.bookingDate);
        this.loading = false;
        
        this.animateBars(this.billBar, this.dueBar, this.profitBar);
      }, (error) => {
        this.toastColor = 'danger';
        this.toastMessage = 'Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.';
        this.isToastOpen = true;
        this.changeLoading = false;
      })
  }

  resetBarsProgress(bar:any){
    return new Promise((resolve) => {
      bar.animate(0, () => {resolve(true)});
    })
  }

  onSlideChange(swiper:SwiperContainer) {
    this.sliderPosition = swiper.swiper.realIndex;
  }

}
