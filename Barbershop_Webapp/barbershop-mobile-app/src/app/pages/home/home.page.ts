import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/home.service';
import { gsap } from 'gsap';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';
import { LoginPage } from '../login/login.page';
import { BillService } from 'src/app/bill.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public notificationData: any = {
    serviceToday: 0,
    billExpired: 0,
    billPending: 0,
    birthsToday: 0,
    birthsMonth: 0
  };
  public notificationCont: string = this.notificationData.length;
  public notificationConfig: any = {
    serviceToday: false,
    billExpired: false,
    billPending: false,
    birthsToday: false,
    birthsMonth: false
  }
  public notificationError: boolean = false;

  name: string = '';
  fullName: string = '';

  constructor(private route: Router, private home: HomeService, public auth: AuthService, private bill:BillService) { }

  async ngOnInit() {

    this.name = this.auth.name.split(' ')[0];

    let nameSplice = this.auth.name.split(' ');
    this.fullName = nameSplice[0].charAt(0).toUpperCase() + nameSplice[0].slice(1).toLowerCase();

    for (let i = 1; i < nameSplice.length - 1; i++) {
      this.fullName += ' ' + nameSplice[i].charAt(0).toUpperCase() + '.';
    }

    if (nameSplice.length > 1) {
      let lastName = nameSplice[nameSplice.length - 1];
      this.fullName += ' ' + lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();
    }

    this.auth.fullName = this.fullName;

    await this.home.getNotificationsConfig().subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.notificationConfig = response.body;
        this.home.notificationConfig = this.notificationConfig;
      } else {
        this.notificationError = true
      }
    }), (error: HttpErrorResponse) => {
      this.notificationError = true
    };

    await this.home.getNotifications().subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.notificationData = response.body;
        this.bill.expiredBills = this.notificationData.billExpired;
      } else {
        this.notificationError = true
      }
    }), (error: HttpErrorResponse) => {
      this.notificationError = true
    };

    gsap.to('#notification-loader', {
      display: 'none'
    })

  }

  async refreshNotification(event: any) {

    console.log("notificações atualizadas");
    await this.home.getNotifications().subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.notificationData = response.body;
        event.target.complete();
      } else {
        this.notificationError = true
        event.target.complete();
      }
    }), (error: HttpErrorResponse) => {
      this.notificationError = true
      event.target.complete();
    };

  }

}
