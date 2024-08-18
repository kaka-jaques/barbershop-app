import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CalendarOptions, DatesSetArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { BillService } from 'src/app/bill.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.page.html',
  styleUrls: ['./bill.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BillPage implements OnInit {

  calendarLoading: boolean = true;
  loadError: boolean = false;
  changeLoading: boolean = false;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, bootstrap5Plugin],
    initialView: 'dayGridMonth',
    locale: ptBrLocale,
    titleFormat: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    },
    themeSystem: 'bootstrap5',
    dateClick: this.handleDateClick.bind(this),
    events: []
  }

  constructor(private bill:BillService) { }

  ngOnInit() {
    this.bill.getBills(new Date().getMonth()+1, new Date().getFullYear()).subscribe((response: HttpResponse<any>) => {
      if(response.ok){
        this.calendarOptions = {
          ...this.calendarOptions,
          headerToolbar: {
            left: 'prev',
            center: 'title',
            right: 'next'
          },
          events: response.body.map((bill: any) => ({
            title: bill.description + ' - ' + bill.bill_type.name,
            start: new Date(bill.year, bill.month-1, bill.day).toISOString(),
            allDay: true
          }))
        }
        this.calendarLoading = false
        // setTimeout(() => {
        //   this.renderCellDay();
        //   this.changeLoading = false;
        //   this.calendarLoading = false;
        // }, 50)
      } else {
        this.loadError = true;
      }
    })
  }

  handleDateClick(arg: any) {

  }

  handleDateChange(arg: DatesSetArg) {

    this.changeLoading = true;

    this.bill.getBills(arg.start.getMonth()+1, arg.start.getFullYear()).subscribe((response: HttpResponse<any>) => {
      if(response.ok){
        this.calendarOptions = {
          ...this.calendarOptions,
          events: response.body.map((bill: any) => ({
            title: bill.description + ' - ' + bill.bill_type.name,
            start: new Date(bill.year, bill.month-1, bill.day).toISOString(),
            allDay: true
          }))
        }
        this.changeLoading = false
        // setTimeout(() => {
        //   this.renderCellDay();
        //   this.changeLoading = false;
        // }, 50)
      } else {
        this.loadError = true;
      }
    })

  }

  renderCellDay() {
    const dayCells = document.getElementsByClassName('fc-daygrid-day') as HTMLCollectionOf<HTMLElement>;

    for (let i = 0; i < dayCells.length; i++) {
      let events = dayCells[i].children[0].children[1].children as HTMLCollectionOf<HTMLElement>;
      
      if(events.length > 1) {
        let badgeCount: HTMLElement = document.createElement('ion-badge');
        badgeCount.innerHTML = (events.length-1).toString();
        badgeCount.setAttribute('color', 'primary');
        dayCells[i].children[0].children[1].innerHTML = ''
        dayCells[i].children[0].children[1].appendChild(badgeCount)
      }

    }

  }

}
