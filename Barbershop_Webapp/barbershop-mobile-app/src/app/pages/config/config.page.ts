import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/config.service';
import { HomeService } from 'src/app/home.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {

  notificationConfig:any = [];
  newNotificationConfig:any;

  isToastOpen: boolean = false;
  toastColor: string = 'primary';
  toastMessage: string = '';

  constructor(private config: ConfigService, private home: HomeService) { }

  ngOnInit() {
    if(this.home.notificationConfig.serviceToday == true){
      this.notificationConfig.push('serviceToday');
    }
    if(this.home.notificationConfig.billExpired == true){
      this.notificationConfig.push('billExpired');
    }
    if(this.home.notificationConfig.billPending == true){
      this.notificationConfig.push('billPending');
    }
    if(this.home.notificationConfig.birthsToday == true){
      this.notificationConfig.push('birthsToday');
    }
    if(this.home.notificationConfig.birthsMonth == true){
      this.notificationConfig.push('birthsMonth');
    }
  }

  changeNotifications(event: any){
    this.newNotificationConfig = {
      id: this.home.notificationConfig.id,
      serviceToday: false,
      billExpired: false,
      billPending: false,
      birthsToday: false,
      birthsMonth: false,
      user: {id: this.home.getUserData().id}
    }
    for(let i=0; i<event.target.value.length; i++){
      if(event.target.value[i] == "serviceToday"){
        this.newNotificationConfig.serviceToday = true;
      }
      if(event.target.value[i] == "billExpired"){
        this.newNotificationConfig.billExpired = true;
      }
      if(event.target.value[i] == "billPending"){
        this.newNotificationConfig.billPending = true;
      }
      if(event.target.value[i] == "birthsToday"){
        this.newNotificationConfig.birthsToday = true;
      }
      if(event.target.value[i] == "birthsMonth"){
        this.newNotificationConfig.birthsMonth = true;
      }
    }

    this.home.setNotificationsConfig(this.newNotificationConfig).subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.home.notificationConfig = this.newNotificationConfig;
        this.toastColor = 'success';
        this.toastMessage = 'Configurações alteradas com sucesso!';
        this.isToastOpen = true;
      }else{
        this.toastColor = 'danger';
        this.toastMessage = 'Erro ao alterar as configurações!';
        this.isToastOpen = true;
        this.newNotificationConfig = this.home.notificationConfig
      }
    })

  }

}
