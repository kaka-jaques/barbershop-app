import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/home.service';
import { gsap } from 'gsap';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';
import { LoginPage } from '../login/login.page';

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

  constructor(private route: Router, private home: HomeService, public auth: AuthService) { }

  async ngOnInit() {

    this.name = this.auth.name.split(' ')[0];

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
