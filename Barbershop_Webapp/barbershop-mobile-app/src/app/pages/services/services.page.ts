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

  isToastOpen: boolean = false
  toastColor: string = 'primary'
  toastMessage: string = ''

  requestError: boolean = false

  constructor(private config:ConfigService) { }

  ngOnInit() {

    this.config.getServices().subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.servicesData = response.body;
      }else{
        this.toastColor = 'danger'
        this.toastMessage = 'Erro ao buscar os serviços!'
        this.isToastOpen = true
      }
    })

  }

  tryRequestAgain(){

  }

  openService(service: any){

  }

}
