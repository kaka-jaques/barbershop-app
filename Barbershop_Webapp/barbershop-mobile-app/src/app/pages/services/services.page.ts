import { Location } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/config.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {

  servicesData:any;
  selectedService:any;
  timeString:string = '00:00'

  isToastOpen: boolean = false
  toastColor: string = 'primary'
  toastMessage: string = ''

  requestError: boolean = false

  constructor(private config:ConfigService, private location:Location) { }

  ngOnInit() {

    this.config.getServices().subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.servicesData = response.body;
        this.requestError = false;
      }else{
        this.requestError = true
        this.toastColor = 'danger'
        this.toastMessage = 'Erro ao buscar os serviços!'
        this.isToastOpen = true
      }
    })

  }

  tryRequestAgain(){
    this.requestError = false;
    this.config.getServices().subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.servicesData = response.body;
        this.requestError = false;
      }else{
        this.requestError = true
        this.toastColor = 'danger'
        this.toastMessage = 'Erro ao buscar os serviços!'
        this.isToastOpen = true
      }
    })
  }

  openService(service: any, modal: any){
    this.selectedService = service;
    this.timeString = this.selectedService.duration[0].toString().padStart(2, '0')+':'+this.selectedService.duration[1].toString().padStart(2, '0');
    modal.present();
  }

  updateTimeArray(event:any){
    const timeParts = event.detail.value.split(':');
    this.selectedService.duration[0] = parseInt(timeParts[0], 10);
    this.selectedService.duration[1] = parseInt(timeParts[1], 10);
  }

  updateService(modal: any){
    this.config.updateService(this.selectedService).subscribe((response: HttpResponse<any>) => {
      if(response.ok){
        this.toastColor = 'success';
        this.toastMessage = 'Serviço atualizado!';
        this.isToastOpen = true;
        modal.dismiss();
      }else{
        this.toastColor = 'danger';
        this.toastMessage = 'Erro ao atualizar Serviço!'
        this.isToastOpen = true;
      }
    })
  }

  goBack(){
    this.location.back();
  }

}
