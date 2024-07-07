import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from 'src/app/home.service';
import { gsap } from 'gsap';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

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
  public notificationError:boolean = false;

  constructor(private route: Router, private home: HomeService) { }

  async ngOnInit() {

    await this.home.getNotificationsConfig().subscribe((response:HttpResponse<any>) => {
      if(response.ok){
        this.notificationConfig = response.body;
      }else{
        this.notificationError = true
      }
    }), (error: HttpErrorResponse) => {
      this.notificationError = true
    };

    this.notificationData = await this.home.getNotifications();

    gsap.to('#notification-loader', {
      display: 'none'
    })

  }

  async refreshNotification(event:any){

    console.log("notificações atualizadas");
    this.notificationData = await this.home.getNotifications();
    setTimeout(() => {
      this.notificationData.billExpired = 3;
      this.notificationData.serviceToday = 31;
      event.target.complete();
    }, 700)

  }

}
