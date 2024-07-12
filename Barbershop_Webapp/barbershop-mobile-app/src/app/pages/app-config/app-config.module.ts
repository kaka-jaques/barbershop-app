import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppConfigPageRoutingModule } from './app-config-routing.module';

import { AppConfigPage } from './app-config.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppConfigPageRoutingModule
  ],
  declarations: [AppConfigPage]
})
export class AppConfigPageModule {}
