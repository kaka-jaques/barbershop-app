import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/book.service';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPuglin from '@fullcalendar/interaction';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit {

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    slotDuration: '00:10:00',
    nowIndicator: true,
    scrollTime: '08:00:00'
  }

  constructor(private bookService:BookService) { }

  ngOnInit() {
  }

}
