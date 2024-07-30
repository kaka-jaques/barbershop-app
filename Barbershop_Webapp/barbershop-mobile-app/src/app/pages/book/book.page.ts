import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BookService } from 'src/app/book.service';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPuglin from '@fullcalendar/interaction';
import ptBtLocale from '@fullcalendar/core/locales/pt-br';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BookPage implements OnInit {

  calendarLoading: boolean = true;
  loadError: boolean = false;
  initialLoad: boolean = true;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPuglin, bootstrap5Plugin],
    initialView: 'timeGridDay',
    slotDuration: '00:10:00',
    nowIndicator: true,
    scrollTime: '08:00:00',
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
    events: []
  }

  constructor(private bookService:BookService) { }

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
      }else{
        this.loadError = true
      }
    })

  }

  handleDateChange(arg: any){

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
      }else{
        this.loadError = true
      }
    })

  }

}
