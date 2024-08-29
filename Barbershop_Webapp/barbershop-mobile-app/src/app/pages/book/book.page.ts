import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { BookService } from 'src/app/book.service';
import { CalendarOptions, DatesSetArg } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBtLocale from '@fullcalendar/core/locales/pt-br';
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import { HttpResponse } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { ConfigService } from 'src/app/config.service';
import { UsersService } from 'src/app/users.service';
import { ActionSheetController, IonModal } from '@ionic/angular';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BookPage implements OnInit {

  @ViewChild('editModal', { static: true, read: ElementRef }) editModal!: ElementRef<IonModal>
  @ViewChild('calendar') calendar!: FullCalendarComponent

  calendarLoading: boolean = true;
  loadError: boolean = false;
  changeLoading: boolean = false;
  calendarType: string = 'calendar';

  requestLoading: boolean = false;

  selectedBook: any;

  books: any;
  services: any;
  clients: any;
  minDate: string = new Date(new Date().setHours(new Date().getHours() - 3)).toISOString();

  newBook: any = {
    bookingDate: new Date(new Date().setHours(new Date().getHours() - 3)).toISOString(),
    services: {},
    client: {
      name: '',
      telephone: '',
      active: false
    }
  };

  toastColor: string = 'primary';
  toastMessage: string = '';
  isToastOpen: boolean = false;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, bootstrap5Plugin],
    initialView: 'timeGridDay',
    slotDuration: '00:10:00',
    nowIndicator: true,
    scrollTime: new Date().getHours().toString().padStart(2, '0') + ':00:00',
    locales: [ptBtLocale],
    locale: 'pt-br',
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next'
    },
    titleFormat: {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    },
    themeSystem: 'bootstrap5',
    datesSet: this.handleDateChange.bind(this),
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    events: []
  }

  constructor(private bookService: BookService, private config: ConfigService, private userService: UsersService, private actSheetCtrl:ActionSheetController) { }

  ngOnInit() {

    this.bookService.getTodayBookings().subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.books = response.body
        this.calendarOptions = {
          ...this.calendarOptions,
          events: response.body.map((book: any) => ({
            title: book.client.name + ' - ' + book.services.name,
            start: new Date(book.bookingDate).toISOString(),
            end: new Date(book.bookingDate + (book.services.duration[1] * 60000) + (book.services.duration[0] * 3600000)).toISOString(),
            extendedProps: {
              ...book
            }
          }))
        }
        this.calendarLoading = false
      } else {
        this.loadError = true
        this.calendarLoading = false
        this.toastColor = 'danger'
        this.toastMessage = 'Erro ao buscar os agendamentos!'
        this.isToastOpen = true
      }
    })

    this.config.getServices().subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.services = response.body
      } else {
        this.loadError = true
        this.toastColor = 'danger'
        this.toastMessage = 'Erro ao buscar os serviços!'
        this.isToastOpen = true
      }
    })

  }

  changeCalendarType() {
    if (this.calendarType === 'calendar') {
      this.calendarType = 'calendar-number'
      this.calendar.getApi().changeView('dayGridMonth');
    } else {
      this.calendarType = 'calendar'
      this.calendar.getApi().changeView('timeGridDay');
    }
  }

  handleEventClick(arg: any) {
    this.selectedBook = {
      ...arg.event.extendedProps
    }
    this.selectedBook.bookingDate = new Date(this.selectedBook.bookingDate).setHours(new Date(this.selectedBook.bookingDate).getHours() - 3);
    this.selectedBook.bookingDate = new Date(this.selectedBook.bookingDate).toISOString();
    this.editModal.nativeElement.present();
  }

  changeClient(modal: any) {
    this.userService.getAllUsers().subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.clients = response.body
        modal.present();
      }
    }, (error) => {
      this.toastColor = 'danger'
      this.toastMessage = 'Erro ao buscar os clientes!'
      this.isToastOpen = true
    })
  }

  resetNewBook(modal:any) {
    this.newBook = {
      bookingDate: new Date(new Date().setHours(new Date().getHours() - 3)).toISOString(),
      services: {},
      client: {
        name: '',
        telephone: '',
        active: false
      }
    };
    modal.present();
  }

  selectChangeClient(client: any, modal: any, modal2: any) {
    this.selectedBook.client = client.client;
    modal.dismiss();
    modal2.dismiss();
  }

  updateBook(modal: any) {
    this.requestLoading = true
    this.bookService.updateBook(this.selectedBook).subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        modal.dismiss();
        this.requestLoading = false
        this.toastColor = 'success'
        this.toastMessage = 'Agendamento atualizado com sucesso!'
        this.isToastOpen = true
        this.calendar.getApi().changeView('timeGridDay', new Date());
      }
    }, (error) => {
      this.toastColor = 'danger'
      this.toastMessage = 'Erro ao atualizar o agendamento!'
      this.isToastOpen = true
      this.requestLoading = false
    })
  }

  async deleteBook(modal: any) {
    this.requestLoading = true

    let deleteConfirmation: () => Promise<boolean> = async (): Promise<boolean> => {
      const sheet = await this.actSheetCtrl.create({
        header: 'Tem certeza?',
        subHeader: 'Esta operação não pode ser desfeita',
        buttons: [
          {
            text: 'Excluir',
            role: 'destructive',
          },
          {
            text: 'Cancelar',
            role: 'cancel'
          }
        ]
      });

      sheet.present();

      const { role } = await sheet.onDidDismiss();
      return role === 'destructive';

    }

    if(await deleteConfirmation()) {
      this.bookService.deleteBook(this.selectedBook.id).subscribe((response: HttpResponse<any>) => {
        if (response.ok) {
          modal.dismiss();
          this.toastColor = 'success'
          this.toastMessage = 'Agendamento excluido com sucesso!'
          this.isToastOpen = true
          this.requestLoading = false
          this.calendar.getApi().changeView('timeGridDay', new Date());
        }
      }, (error) => {
        this.toastColor = 'danger'
        this.toastMessage = 'Erro ao excluir o agendamento!'
        this.isToastOpen = true
        this.requestLoading = false
      })
    }else{
      this.requestLoading = false
    }
  }

  async handleDateChange(arg: any) {

    this.changeLoading = true;

    this.bookService.getPeriodBookings(arg.startStr, arg.endStr).subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.books = response.body
        this.calendarOptions = {
          ...this.calendarOptions,
          events: response.body.map((book: any) => ({
            title: book.client.name + ' - ' + book.services.name,
            start: new Date(book.bookingDate).toISOString(),
            end: new Date(book.bookingDate + (book.services.duration[1] * 60000) + (book.services.duration[0] * 3600000)).toISOString(),
            extendedProps: {
              ...book
            }
          }))
        }
        setTimeout(() => {
          this.renderCellDay();
          this.changeLoading = false;
          return true;
        }, 50)
      } else {
        this.loadError = true
        this.changeLoading = false
        this.toastColor = 'danger'
        this.toastMessage = 'Erro ao buscar os agendamentos!'
        this.isToastOpen = true
      }
    })
  }

  handleDateClick(arg: any) {
    if (arg.view.type != 'timeGridDay') {
      const calendarApi = arg.view.calendar;
      calendarApi.changeView('timeGridDay', arg.date);
      this.changeCalendarType();
    }
  }

  renderCellDay() {

    const dayCells = document.getElementsByClassName('fc-daygrid-day') as HTMLCollectionOf<HTMLElement>;

    for (let i = 0; i < dayCells.length; i++) {
      let events = dayCells[i].children[0].children[1].children as HTMLCollectionOf<HTMLElement>;

      if (events.length > 1) {
        let badgeCount: HTMLElement = document.createElement('ion-badge');
        badgeCount.innerHTML = (events.length - 1).toString();
        badgeCount.setAttribute('color', 'primary');
        dayCells[i].children[0].children[1].innerHTML = ''
        dayCells[i].children[0].children[1].appendChild(badgeCount)
      }

    }
  }

  async createBook(modal: any) {
    this.requestLoading = true

    let newEvent = this.newBook.bookingDate;
    let newEventDate: Date = new Date(newEvent);
    newEventDate.setHours(0);
    newEventDate.setMinutes(0);

    if (this.newBook.client.name == '' || this.newBook.client.telephone == '' || this.newBook.services.id == null) {
      this.toastColor = 'primary'
      this.toastMessage = 'Por favor, Preencha todos os campos!'
      this.isToastOpen = true
      this.requestLoading = false;
      return;
    }

    this.bookService.getPeriodBookings(newEventDate.toISOString(), newEventDate.toISOString().split('T')[0] + 'T23:59:59.999Z').subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.books = response.body
        this.requestLoading = false
        this.calendarOptions = {
          ...this.calendarOptions,
          events: response.body.map((book: any) => ({
            title: book.client.name + ' - ' + book.services.name,
            start: new Date(book.bookingDate).toISOString(),
            end: new Date(book.bookingDate + (book.services.duration[1] * 60000) + (book.services.duration[0] * 3600000)).toISOString(),
            extendedProps: {
              ...book
            }
          }))
        }
        setTimeout(() => {
          this.verifyAndCreateBook(newEvent, modal);
        }, 50)
      } else {
        this.requestLoading = false
        this.loadError = true
        this.changeLoading = false
        this.toastColor = 'danger'
        this.toastMessage = 'Erro ao buscar os agendamentos!'
        this.isToastOpen = true
      }
    }, (error) => {
      this.requestLoading = false
      this.loadError = true
      this.changeLoading = false
      this.toastColor = 'danger'
      this.toastMessage = 'Erro ao buscar os agendamentos!'
      this.isToastOpen = true
    })

  }

  verifyAndCreateBook(newEvent: any, modal: any) {
    let events = this.calendar.getApi().getEvents();
    let overDate = false;
    let newEventStart = new Date(newEvent);
    let newEventEnd = new Date(new Date(newEvent).getTime() + (this.newBook.services.duration[1] * 60000) + (this.newBook.services.duration[0] * 3600000));

    events.forEach((event: any) => {
      let existEventStart = new Date(event.start)
      let existEventEnd = new Date(event.end)

      if (
        (newEventStart < existEventEnd && newEventEnd > existEventStart) ||
        (newEventEnd > existEventStart && newEventEnd <= existEventEnd) ||
        (newEventStart >= existEventStart && newEventEnd <= existEventEnd)
      ) {
        this.toastColor = 'danger'
        this.toastMessage = 'Existe um agendamento no mesmo horário entre ' + existEventStart.toLocaleTimeString() + ' e ' + existEventEnd.toLocaleTimeString()
        this.isToastOpen = true
        this.requestLoading = false
        overDate = true
        return
      }
    })

    if (!overDate) {
      const auth: boolean = this.newBook.client.id != null

      this.bookService.createBook(this.newBook, auth).subscribe((response: HttpResponse<any>) => {
        if (response.ok) {
          modal.dismiss();
          this.toastColor = 'success'
          this.toastMessage = 'Agendamento criado com sucesso!'
          this.isToastOpen = true
          this.requestLoading = false
          this.calendar.getApi().changeView(this.calendar.getApi().view.type);
        }
      }, (error) => {
        this.loadError = true
        this.toastColor = 'danger'
        this.toastMessage = 'Erro ao criar o agendamento!'
        this.isToastOpen = true
        this.requestLoading = false
      })
    }
  }

  changeService(event: any) {
    this.newBook.services = this.services.find((service: any) => service.id === event.detail.value)
  }

  searchClient() {
    this.userService.getAllUsers().subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.clients = response.body
      } else {
        this.loadError = true
        this.toastColor = 'danger'
        this.toastMessage = 'Erro ao buscar os clientes!'
        this.isToastOpen = true
      }
    }, (error) => {
      this.loadError = true
      this.toastColor = 'danger'
      this.toastMessage = 'Erro ao buscar os clientes!'
      this.isToastOpen = true
    })
  }

  selectClient(client: any, modal: any, modal2: any) {
    this.newBook.client = client.client
    modal.dismiss();
    modal2.dismiss();
  }

}
