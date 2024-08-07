import { Location } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { ConfigService } from 'src/app/config.service';

@Component({
  selector: 'app-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit {

  newService: any = {
    name: '',
    description: '',
    duration: [0, 0],
    price: 0.0
  }

  servicesData:any;
  selectedService:any;
  timeString:string = '00:00'

  isToastOpen: boolean = false
  toastColor: string = 'primary'
  toastMessage: string = ''

  requestError: boolean = false

  constructor(private config:ConfigService, private location:Location, private actSheetCtrl: ActionSheetController) { }

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

  formatPrice(event: any){
    let value = event.target.value;
    value = value.replace(/\D/g, '');
    value = (parseInt(value) / 100).toFixed(2) + ''; 
    value = value.replace('.', ',');
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    this.newService.price = value;
  }

  openAddModal(){
    this.newService = {
      name: '',
      description: '',
      duration: [0, 0],
      price: 0.0
    }
    this.timeString = '00:00'
  }

  createService(modal: any){
    this.newService.duration = this.timeString.split(':').map(Number)
    this.newService.price = parseFloat(this.newService.price.replace(',', '.'))
    this.config.createService(this.newService).subscribe((response: HttpResponse<any>) => {
      if(response.ok){
        this.toastColor = 'success'
        this.toastMessage = 'Serviço criado com sucesso!'
        this.isToastOpen = true
        modal.dismiss();
      }else{
        this.toastColor = 'danger'
        this.toastMessage = 'Erro ao criar o serviço!'
        this.isToastOpen = true
      }
    })
    this.ngOnInit();
  }

  async deleteService(service: any, modal: any){

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

    if (await deleteConfirmation()) {
      this.config.deleteService(service).subscribe((response: HttpResponse<any>) => {
        if(response.ok){
          this.toastColor = 'success'
          this.toastMessage = 'Serviço deletado com sucesso!'
          this.isToastOpen = true
          modal.dismiss();
          this.ngOnInit();
        }else{
          this.toastColor = 'danger'
          this.toastMessage = 'Erro ao deletar o serviço!'
          this.isToastOpen = true
        }
      })
    }
    
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

  updateNewTimeArray(event:any){
    const timeParts = event.detail.value.split(':');
    this.newService.duration[0] = parseInt(timeParts[0], 10);
    this.newService.duration[1] = parseInt(timeParts[1], 10);
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
