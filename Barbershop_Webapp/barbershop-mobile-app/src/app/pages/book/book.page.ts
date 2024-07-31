import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BookService } from 'src/app/book.service';
import { CalendarOptions, DatesSetArg } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPuglin from '@fullcalendar/interaction';
import ptBtLocale from '@fullcalendar/core/locales/pt-br';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { HttpResponse } from '@angular/common/http';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BookPage implements OnInit {

  calendarLoading: boolean = true;
  loadError: boolean = false;
  changeLoading: boolean = false;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPuglin, bootstrap5Plugin],
    initialView: 'timeGridDay',
    slotDuration: '00:10:00',
    nowIndicator: true,
    scrollTime: new Date().getHours().toString().padStart(2, '0') + ':00:00',
    locales: [ptBtLocale],
    locale: 'pt-br',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridDay'
    },
    titleFormat: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    },
    themeSystem: 'bootstrap5',
    datesSet: this.handleDateChange.bind(this),
    dateClick: this.handleDateClick.bind(this),
    events: []
  }

  constructor(private bookService: BookService) { }

  ngOnInit() {

    this.bookService.getTodayBookings().subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.calendarOptions = {
          ...this.calendarOptions,
          events: response.body.map((book: any) => ({
            title: book.client.name + ' - ' + book.services.name,
            start: new Date(book.bookingDate).toISOString(),
            end: new Date(book.bookingDate + (book.services.duration[1] * 60000) + (book.services.duration[0] * 3600000)).toISOString()
          }))
        }
        this.calendarLoading = false
      } else {
        this.loadError = true
      }
    })

  }

  handleDateChange(arg: DatesSetArg) {

    this.changeLoading = true;

    this.bookService.getPeriodBookings(arg.startStr, arg.endStr).subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.calendarOptions = {
          ...this.calendarOptions,
          events: response.body.map((book: any) => ({
            title: book.client.name + ' - ' + book.services.name,
            start: new Date(book.bookingDate).toISOString(),
            end: new Date(book.bookingDate + (book.services.duration[1] * 60000) + (book.services.duration[0] * 3600000)).toISOString()
          }))
        }
        setTimeout(() => {
          this.renderCellDay();
          this.changeLoading = false;
        }, 50)
      } else {
        this.loadError = true
      }
    })

  }

  handleDateClick(arg: any) {
    const calendarApi = arg.view.calendar;
    calendarApi.changeView('timeGridDay', arg.date);
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
