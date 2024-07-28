import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular'

import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared/shared.module';

import { BookPageRoutingModule } from './book-routing.module';

import { BookPage } from './book.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BookPageRoutingModule,
    SharedModule,
    FullCalendarModule
  ],
  declarations: [BookPage]
})
export class BookPageModule {}
