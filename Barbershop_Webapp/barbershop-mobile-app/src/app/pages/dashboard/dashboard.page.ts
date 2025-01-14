import { Component, OnInit, ViewEncapsulation, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import * as ProgressBar from 'progressbar.js';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
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
  loadError: boolean = false;
  changeLoading: boolean = false;
  viewToggle: boolean = false;
  toastColor: string = 'primary';
  toastMessage: string = '';
  isToastOpen: boolean = false;
  sliderPosition: number = 0;
  profitGroupVisible: boolean = false;
  billGroupVisible: boolean = false;
  viewToggleLegend: boolean = false;

  allBars: any = [];
  allBarsCharts: any = [];

  profitBar: any;
  dueBar: any;
  billBar: any;

  profitQt: number = 0;
  dueQt: number = 1000;
  billQt: number = 0;
  totalQt: number = 0;

  servicesQt: number = 0;
  qtServicesQueue: any = {};
  totalServicesQueue: number = 0;

  servicesBars: any;

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
    'Finança',
    'Serviços',
    'Slide 3'
  ]
  servicesColors = [
    {
      ionColor: 'primary',
      hexaColor: '#0054e9',
      serviceId: 0
    },
    {
      ionColor: 'secondary',
      hexaColor: '#0163aa',
      serviceId: 0
    },
    {
      ionColor: 'tertiary',
      hexaColor: '#6030ff',
      serviceId: 0
    },
    {
      ionColor: 'success',
      hexaColor: '#2dd55b',
      serviceId: 0
    },
    {
      ionColor: 'warning',
      hexaColor: '#ffc409',
      serviceId: 0
    },
    {
      ionColor: 'danger',
      hexaColor: '#c5000f',
      serviceId: 0
    },
    {
      ionColor: 'dark',
      hexaColor: '#2f2f2f',
      serviceId: 0
    },
    {
      ionColor: 'medium',
      hexaColor: '#5f5f5f',
      serviceId: 0
    },
    {
      ionColor: 'light',
      hexaColor: '#f6f8fc',
      serviceId: 0
    }
  ]

  constructor(private bill: BillService, private book: BookService, private config: ConfigService, private authService:AuthService) { }

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

    this.allBars = [profitBar, dueBar, billBar];

    forkJoin([this.bill.getBills(this.month + 1, this.year), this.book.getPeriodBookings(new Date(this.year, this.month, 1).toISOString(), new Date(this.year, this.month + 1, 0).toISOString(), 0), this.config.getServices()])
      .pipe()
      .subscribe((response: any) => {

        this.bills = response[0].body.map((bill: any) => ({
          ...bill,
          value: bill.value - bill.value * 2,
          bookingDate: new Date(bill.year, bill.month - 1, bill.day).getTime(),
          type: bill.bill_type.name
        }));

        this.books = response[1].body.map((book: any) => ({
          ...book,
          value: book.services.price,
          type: book.services.name
        }));

        this.services = response[2].body;
        this.servicesQt = this.services.length;

        let i = 0;

        this.services.forEach((service: any) => {
          this.qtServicesQueue[service.id] = 0;
          this.servicesColors[i].serviceId = service.id;
          i++;
        });

        this.books.forEach((book: any) => {
          if (book.services && book.services.id) {
            const serviceId = book.services.id;
            
            if (this.qtServicesQueue.hasOwnProperty(serviceId)) {
              this.qtServicesQueue[serviceId] += 1;
            } else {
              this.qtServicesQueue[serviceId] = 1; 
            }
            this.totalServicesQueue += 1;
          }
        });

        for (let i = 0; i < this.servicesQt; i++) {
          this.services[i] = {
            ...this.services[i],
            pos: i
          }
        }

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
          this.allBarsCharts[0] = 1
          this.allBarsCharts[2] = this.billQt / this.totalQt;
          this.allBarsCharts[1] = (this.dueQt / this.totalQt) + this.allBarsCharts[2];
        } else if (this.totalQt < 0) {
          this.totalQt = this.totalQt * -1
          this.allBarsCharts[0] = (this.profitQt / this.totalQt) + (this.dueQt / this.totalQt) + (this.billQt / this.totalQt);
          this.allBarsCharts[2] = this.billQt / this.totalQt;
          this.allBarsCharts[1] = (this.dueQt / this.totalQt) + this.allBarsCharts[2];
        } else {
          this.totalQt = this.profitQt + this.dueQt + this.billQt
          this.allBarsCharts[0] = (this.profitQt / this.totalQt) + (this.dueQt / this.totalQt) + (this.billQt / this.totalQt);
          this.allBarsCharts[2] = this.billQt / this.totalQt;
          this.allBarsCharts[1] = (this.dueQt / this.totalQt) + this.allBarsCharts[2];
        }

        if(isNaN(this.allBarsCharts[0])){
          this.allBarsCharts[0] = 0
        }

        if(isNaN(this.allBarsCharts[1])){
          this.allBarsCharts[1] = 0
        }

        if(isNaN(this.allBarsCharts[2])){
          this.allBarsCharts[2] = 0
        }

        this.data = [...this.bills, ...this.books];
        this.data.sort((a: any, b: any) => a.bookingDate - b.bookingDate);
        this.loading = false;

        setTimeout(() => {

          for (let i = 0; i < this.servicesQt; i++) {
            var bar = new ProgressBar.Circle('#bar' + i, {
              strokeWidth: 6,
              easing: 'easeInOut',
              duration: 1000,
              color: this.getHexaColor(this.services[i].id),
              trailColor: 'transparent',
              svgStyle: null
            })
            
            if(i>0){
              this.allBarsCharts[this.servicesQt+2-i] =(this.qtServicesQueue[this.services[i].id]/this.totalServicesQueue) + this.allBarsCharts[this.servicesQt+3-i];
              if(isNaN(this.allBarsCharts[this.servicesQt+2-i])){
                this.allBarsCharts[this.servicesQt+2-i] = 0
              }
            }else{
              this.allBarsCharts[this.servicesQt+2] = (this.qtServicesQueue[this.services[i].id]/this.totalServicesQueue);
              if(isNaN(this.allBarsCharts[this.servicesQt+2])){
                this.allBarsCharts[this.servicesQt+2] = 0
              }
            }
            this.allBars[i+3] = bar;
          }
          this.animateBars(this.allBars);
        }, 50)

      }, (error)=>{
        this.toastColor = 'danger';
        this.toastMessage = 'Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.';
        this.isToastOpen = true;
        this.changeLoading = false;
        this.loading = false;
        this.loadError = true;
      })

  }

  getIonicColor(id: number){
    return this.servicesColors.find((s: any) => s.serviceId == id)?.ionColor
  }

  getHexaColor(id: number){
    return this.servicesColors.find((s: any) => s.serviceId == id)?.hexaColor
  }

  animateBars(bars: any) {
    for (let i = 0; i < bars.length; i++) {
      if (this.sliderPosition == 0) {
        if (i < 3) {
          bars[i].animate(this.allBarsCharts[i]);
        } else {
          break;
        }
      } else if (this.sliderPosition == 1) {
        if (i > 2) {
          bars[i]?.animate(this.allBarsCharts[i]);
        }
      }
    }
    this.changeLoading = false;
  }

  nextSlide(swiper: SwiperContainer) {
    swiper.swiper.slideNext();
  }

  backSlide(swiper: SwiperContainer) {
    swiper.swiper.slidePrev();
  }

  prevMonth() {
    this.changeLoading = true;
    this.month--;
    if (this.month < 0) {
      this.month = 11;
      this.year--;
    }
    this.getPeriodData();
  }

  nextMonth() {
    this.changeLoading = true;
    this.month++;
    if (this.month > 11) {
      this.month = 0;
      this.year++;
    }
    this.getPeriodData();
  }

  getPeriodData() {

    this.billQt = 0;
    this.profitQt = 0;
    this.allBarsCharts = []
    this.totalQt = 0;
    this.totalServicesQueue = 0;
    
    Object.keys(this.qtServicesQueue).forEach((key: string) => {
      this.qtServicesQueue[key] = 0;
    });

    forkJoin([this.bill.getBills(this.month + 1, this.year), this.book.getPeriodBookings(new Date(this.year, this.month, 1).toISOString(), new Date(this.year, this.month + 1, 0).toISOString(), 0), this.resetBarsProgress(this.allBars)])
      .pipe()
      .subscribe((response: any) => {
        this.bills = response[0].body.map((bill: any) => ({
          ...bill,
          value: bill.value - bill.value * 2,
          bookingDate: new Date(bill.year, bill.month - 1, bill.day).getTime(),
          type: bill.bill_type.name
        }));

        this.books = response[1].body.map((book: any) => ({
          ...book,
          value: book.services.price,
          type: book.services.name
        }));

        this.books.forEach((book: any) => {
          if (book.services && book.services.name) {
            const serviceId = book.services.id;
            
            if (this.qtServicesQueue.hasOwnProperty(serviceId)) {
              this.qtServicesQueue[serviceId] += 1;
            } else {
              this.qtServicesQueue[serviceId] = 1; 
            }
            this.totalServicesQueue += 1;
          } else {
            console.error("Serviço não encontrado ou nome do serviço está undefined:", book);
          }
        }); 

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
          this.allBarsCharts[0] = (this.profitQt / this.totalQt) + (this.dueQt / this.totalQt) + (this.billQt / this.totalQt);
          this.allBarsCharts[2] = this.billQt / this.totalQt;
          this.allBarsCharts[1] = (this.dueQt / this.totalQt) + this.allBarsCharts[2];
        } else if (this.totalQt < 0) {
          this.totalQt = this.totalQt * -1
          this.allBarsCharts[0] = (this.profitQt / this.totalQt) + (this.dueQt / this.totalQt) + (this.billQt / this.totalQt);
          this.allBarsCharts[2] = this.billQt / this.totalQt;
          this.allBarsCharts[1] = (this.dueQt / this.totalQt) + this.allBarsCharts[2];
        } else {
          this.totalQt = this.profitQt + this.dueQt + this.billQt
          this.allBarsCharts[0] = (this.profitQt / this.totalQt) + (this.dueQt / this.totalQt) + (this.billQt / this.totalQt);
          this.allBarsCharts[2] = this.billQt / this.totalQt;
          this.allBarsCharts[1] = (this.dueQt / this.totalQt) + this.allBarsCharts[2];
        }

        if(isNaN(this.allBarsCharts[0])){
          this.allBarsCharts[0] = 0
        }

        if(isNaN(this.allBarsCharts[1])){
          this.allBarsCharts[1] = 0
        }

        if(isNaN(this.allBarsCharts[2])){
          this.allBarsCharts[2] = 0
        }

        this.data = [...this.bills, ...this.books];
        this.data.sort((a: any, b: any) => a.bookingDate - b.bookingDate);
        this.loading = false;

        for (let i = 0; i < this.servicesQt; i++) {
          
          if(i>0){
            this.allBarsCharts[this.servicesQt+2-i] =(this.qtServicesQueue[this.services[i].id] / this.totalServicesQueue) + this.allBarsCharts[this.servicesQt+3-i];
            if(isNaN(this.allBarsCharts[this.servicesQt+2-i])){
              this.allBarsCharts[this.servicesQt+2-i] = 0
            }
          }else{
            this.allBarsCharts[this.servicesQt+2] = (this.qtServicesQueue[this.services[i].id] / this.totalServicesQueue)
            if(isNaN(this.allBarsCharts[this.servicesQt+2])){
              this.allBarsCharts[this.servicesQt+2] = 0
            }
          }
        }

        this.animateBars(this.allBars);
        console.log(this.services);
        console.log(this.qtServicesQueue);
        console.log(this.totalServicesQueue);
        
        console.log(this.allBarsCharts);
        
      }, (error) => {
        this.toastColor = 'danger';
        this.toastMessage = 'Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.';
        this.isToastOpen = true;
        this.changeLoading = false;
      })
  }

  resetBarsProgress(bars: any) {
    return new Promise((resolve) => {
      for(let bar of bars){
        bar.animate(0);
      }
      resolve(true);
    })
  }

  onSlideChange(swiper: SwiperContainer) {
    this.sliderPosition = swiper.swiper.realIndex;
    this.resetBarsProgress(this.allBars)
    this.animateBars(this.allBars);
  }

  reloadDashboard() {

    forkJoin([this.bill.getBills(this.month + 1, this.year), this.book.getPeriodBookings(new Date(this.year, this.month, 1).toISOString(), new Date(this.year, this.month + 1, 0).toISOString(), 0), this.config.getServices()])
      .pipe()
      .subscribe((response: any) => {

        this.bills = response[0].body.map((bill: any) => ({
          ...bill,
          value: bill.value - bill.value * 2,
          bookingDate: new Date(bill.year, bill.month - 1, bill.day).getTime(),
          type: bill.bill_type.name
        }));

        this.books = response[1].body.map((book: any) => ({
          ...book,
          value: book.services.price,
          type: book.services.name
        }));

        this.services = response[2].body;
        this.servicesQt = this.services.length;

        let i = 0;

        this.services.forEach((service: any) => {
          this.qtServicesQueue[service.id] = 0;
          this.servicesColors[i].serviceId = service.id;
          i++;
        });

        this.books.forEach((book: any) => {
          if (book.services && book.services.id) {
            const serviceId = book.services.id;
            
            if (this.qtServicesQueue.hasOwnProperty(serviceId)) {
              this.qtServicesQueue[serviceId] += 1;
            } else {
              this.qtServicesQueue[serviceId] = 1; 
            }
            this.totalServicesQueue += 1;
          }
        });

        for (let i = 0; i < this.servicesQt; i++) {
          this.services[i] = {
            ...this.services[i],
            pos: i
          }
        }

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
          this.allBarsCharts[0] = 1
          this.allBarsCharts[2] = this.billQt / this.totalQt;
          this.allBarsCharts[1] = (this.dueQt / this.totalQt) + this.allBarsCharts[2];
        } else if (this.totalQt < 0) {
          this.totalQt = this.totalQt * -1
          this.allBarsCharts[0] = (this.profitQt / this.totalQt) + (this.dueQt / this.totalQt) + (this.billQt / this.totalQt);
          this.allBarsCharts[2] = this.billQt / this.totalQt;
          this.allBarsCharts[1] = (this.dueQt / this.totalQt) + this.allBarsCharts[2];
        } else {
          this.totalQt = this.profitQt + this.dueQt + this.billQt
          this.allBarsCharts[0] = (this.profitQt / this.totalQt) + (this.dueQt / this.totalQt) + (this.billQt / this.totalQt);
          this.allBarsCharts[2] = this.billQt / this.totalQt;
          this.allBarsCharts[1] = (this.dueQt / this.totalQt) + this.allBarsCharts[2];
        }

        if(isNaN(this.allBarsCharts[0])){
          this.allBarsCharts[0] = 0
        }

        if(isNaN(this.allBarsCharts[1])){
          this.allBarsCharts[1] = 0
        }

        if(isNaN(this.allBarsCharts[2])){
          this.allBarsCharts[2] = 0
        }

        this.data = [...this.bills, ...this.books];
        this.data.sort((a: any, b: any) => a.bookingDate - b.bookingDate);
        this.loading = false;

        setTimeout(() => {

          for (let i = 0; i < this.servicesQt; i++) {
            var bar = new ProgressBar.Circle('#bar' + i, {
              strokeWidth: 6,
              easing: 'easeInOut',
              duration: 1000,
              color: this.getHexaColor(this.services[i].id),
              trailColor: 'transparent',
              svgStyle: null
            })
            
            if(i>0){
              this.allBarsCharts[this.servicesQt+2-i] =(this.qtServicesQueue[this.services[i].id]/this.totalServicesQueue) + this.allBarsCharts[this.servicesQt+3-i];
              if(isNaN(this.allBarsCharts[this.servicesQt+2-i])){
                this.allBarsCharts[this.servicesQt+2-i] = 0
              }
            }else{
              this.allBarsCharts[this.servicesQt+2] = (this.qtServicesQueue[this.services[i].id]/this.totalServicesQueue);
              if(isNaN(this.allBarsCharts[this.servicesQt+2])){
                this.allBarsCharts[this.servicesQt+2] = 0
              }
            }
            this.allBars[i+3] = bar;
          }
          this.animateBars(this.allBars);
        }, 50)

      }, (error)=>{
        this.toastColor = 'danger';
        this.toastMessage = 'Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.';
        this.isToastOpen = true;
        this.changeLoading = false;
        this.loading = false;
      })

  }

}
