import { Location } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { ConfigService } from 'src/app/config.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.page.html',
  styleUrls: ['./plans.page.scss'],
})
export class PlansPage implements OnInit {

  planos: any;
  selectedPlan: any;
  newPlan: any = {
    name: '',
    description: '',
    price: 0,
    services_include: []
  }
  services: any;
  servicesSelected: any = [];

  toastColor: string = 'primary';
  toastMessage: string = '';
  isToastOpen: boolean = false;
  sendRequest: boolean = false;
  requestError: boolean = false;

  constructor(private config: ConfigService, private location: Location, private actSheetCtrl: ActionSheetController) { }

  ngOnInit() {
    this.config.getPlans().subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.planos = response.body;
      } else {
        this.requestError = true
        this.toastColor = 'danger'
        this.toastMessage = 'Erro ao carregar os planos!'
        this.isToastOpen = true
      }
    })
    this.config.getServices().subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.services = response.body;
      } else {
        this.requestError = true
        this.toastColor = 'danger'
        this.toastMessage = 'Erro ao carregar os serviços! Não será possível adicionar serviços ao plano.'
        this.isToastOpen = true
      }
    })
  }

  changeServices(event: any) {
    this.servicesSelected = []; 
    for (let ss of event.detail.value) {
      for(let sr of this.services) {
        if (ss == sr.name) {
          this.selectedPlan.services_include.push(sr)
        }
      }
    }
  }

  changeNewServices(event: any) {
    this.newPlan.services_include = [];
    for (let ss of event.detail.value) {
      for(let sr of this.services) {
        if (ss == sr.name) {
          this.newPlan.services_include.push(sr)
        }
      }
    }
  }

  goBack() {
    this.location.back();
  }

  tryRequestAgain() {
    this.requestError = false;
    this.config.getPlans().subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.planos = response.body;
      } else {
        this.requestError = true
        this.toastColor = 'danger'
        this.toastMessage = 'Erro ao carregar os planos!'
        this.isToastOpen = true
      }
    })
  }

  openAddModal() {
    this.newPlan = {
      name: '',
      description: '',
      price: 0,
      services_include: []
    }
  }

  openEditModal(plan: any, modal: any) {
    this.selectedPlan = plan;
    this.servicesSelected = [];
    for (let service of this.selectedPlan.services_include) {
      this.servicesSelected.push(service.name)
    }
    modal.present();
  }

  updatePlan(modal: any) {
    this.sendRequest = true
    this.config.updatePlan(this.selectedPlan).subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.toastColor = 'success'
        this.toastMessage = 'Plano atualizado com sucesso!'
        this.isToastOpen = true
        modal.dismiss();
        this.ngOnInit();
        this.sendRequest = false
      } else {
        this.toastColor = 'danger'
        this.toastMessage = 'Erro ao atualizar o plano!'
        this.isToastOpen = true
        this.sendRequest = false
      }
    })
  }

  formatPrice(event: any) {
    let value = event.target.value;
    value = value.replace(/\D/g, '');
    value = (parseInt(value) / 100).toFixed(2) + '';
    this.newPlan.price = value;
  }

  formatPriceUpdate(event: any) {
    let value = event.target.value;
    value = value.replace(/\D/g, '');
    value = (parseInt(value) / 100).toFixed(2) + '';
    this.selectedPlan.price = value;
  }

  createPlan(modal: any) {
    this.sendRequest = true
    this.config.createPlan(this.newPlan).subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.toastColor = 'success'
        this.toastMessage = 'Plano criado com sucesso!'
        this.isToastOpen = true
        this.sendRequest = false
        modal.dismiss();
        this.ngOnInit();
      } else {
        this.toastColor = 'danger'
        this.toastMessage = 'Erro ao criar o plano!'
        this.isToastOpen = true
        this.sendRequest = false
      }
    })
  }

  async deletePlan(plan:any, modal: any) {
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
      this.config.deletePlan(plan).subscribe((response: HttpResponse<any>) => {
        if (response.ok) {
          this.toastColor = 'success'
          this.toastMessage = 'Plano deletado com sucesso!'
          this.isToastOpen = true
          modal.dismiss();
          this.ngOnInit();
        } else {
          this.toastColor = 'danger'
          this.toastMessage = 'Erro ao deletar o plano!'
          this.isToastOpen = true
        }
      })
    }

  }

}
