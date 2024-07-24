import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  public usersList: any[] = [];
  public userQuery: any[] = [];

  public tempClientList: any[] = [];
  public tempClientQuery: any[] = [];

  //PARAMETROS PARA FITLRO
  public user!: string;
  public email!: string;
  public startBirthDate!: Date;
  public endBirthDate!: Date;
  public activeUser!: Boolean;
  public phone!: string;
  public anualBonus!: Boolean;
  public plan!: number;
  public cpf!: string;

  public roles: any = [
    { id: 1, name: 'ROLE_ADMIN' },
    { id: 2, name: 'ROLE_EMPLOYEE' },
    { id: 3, name: 'ROLE_MEMBER' }
  ];

  public selectedClient: any = {
    client: {
      name: 'Nan'
    }
  };

  public selectedUser: any = {
    client: {
      name: 'Nan'
    }
  };
  public newUser:any = {
    user: '',
    password: '',
    email: '',
    client:{
      name: '',
      birthDate: '',
      phone: '',
      anualBonus: false,
      plano: {
        id: 1
      },
      cpf: '',
    }
  };

  public birthDate!: string;
  public saveUserButton: Boolean = false;
  public isToastOpen: Boolean = false;
  public toastMessage!: string;
  public toastColor: string = 'light';

  public currentRole!: any;

  constructor(private users: UsersService, private actSheetCtrl: ActionSheetController) { }

  async ngOnInit() {
    await this.users.getAllUsers().subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.usersList = response.body;
        this.userQuery = [...this.usersList];
        this.alphabeticalOrder();
        setTimeout(() => {
          document.querySelector('ion-item-sliding')?.open('end');
          setTimeout(() => {
            document.querySelector('ion-item-sliding')?.close();
          }, 1500)
        }, 500)
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
      this.isToastOpen = true;
      this.toastColor = 'danger';
      this.toastMessage = 'Erro ao buscar os usuários!';
      this.saveUserButton = false;
    });

    await this.users.getTempClients().subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.tempClientList = response.body;
        this.tempClientQuery = [...this.tempClientList];
        this.alphabeticalOrderTempClients();
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
      this.isToastOpen = true;
      this.toastColor = 'danger';
      this.toastMessage = 'Erro ao buscar os clientes!';
      this.saveUserButton = false;
    });

  }

  searchUser(event: any) {
    const query: string = event.target.value.toLowerCase();
    this.userQuery = this.usersList.filter(user => user.client.name.toLowerCase().indexOf(query) > -1);
  }

  async refreshUsers(event: any) {
    await this.users.getAllUsers().subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.usersList = response.body;
        this.userQuery = [...this.usersList];
        this.alphabeticalOrder();
        event.target.complete();
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
      this.isToastOpen = true;
      this.toastColor = 'danger';
      this.toastMessage = 'Erro ao buscar os usuários!';
      this.saveUserButton = false;
      event.target.complete();
    });
    await this.users.getTempClients().subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.tempClientList = response.body;
        this.tempClientQuery = [...this.tempClientList];
        this.alphabeticalOrderTempClients();
        event.target.complete();
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
      this.isToastOpen = true;
      this.toastColor = 'danger';
      this.toastMessage = 'Erro ao buscar os clientes!';
      this.saveUserButton = false;
      event.target.complete();
    });
  }

  alphabeticalOrder() {
    this.userQuery.sort((a, b) => {
      if (a.client.name < b.client.name) return -1;
      if (a.client.name > b.client.name) return 1;
      return 0;
    });
  }

  alphabeticalOrderTempClients() {
    this.tempClientQuery.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    });
  }

  applyFilter() {

  }

  applyRole(role: number, modal: any) {
    this.selectedUser.role[0] = this.roles[role];
    modal.dismiss();
  }

  resetFilter(modal: any) {
    modal.dismiss();
  }

  openUser(user: any, modal: any) {
    this.selectedUser = user;
    if (user.client.birthDate != null) {
      this.birthDate = new Date(this.selectedUser.client.birthDate[0], this.selectedUser.client.birthDate[1] - 1, this.selectedUser.client.birthDate[2]).toISOString();
    } else {
      this.birthDate = '';
    }
    modal.present();
  }

  async deleteUser(user: any, modal: any) {

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
      this.users.deleteUser(user).subscribe((response: HttpResponse<any>) => {
        if (response.ok) {
          this.isToastOpen = true;
          this.toastColor = 'success';
          this.toastMessage = 'cliente excluído com sucesso!';
          this.refreshUsers(null);
          modal.dismiss();
        }else{
          this.isToastOpen = true;
          this.toastColor = 'danger';
          this.toastMessage = 'Erro ao excluir o cliente!';
          modal.dismiss();
        }
      })
    }
  }

  async deleteClient(client: any, modal: any) {
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
      this.users.deleteClient(client).subscribe((response: HttpResponse<any>) => {
        if (response.ok) {
          this.isToastOpen = true;
          this.toastColor = 'success';
          this.toastMessage = 'cliente excluído com sucesso!';
          this.refreshUsers(null);
          modal.dismiss();
        }else{
          this.isToastOpen = true;
          this.toastColor = 'danger';
          this.toastMessage = 'Erro ao excluir o cliente!';
          modal.dismiss();
        }
      })
    }
  }

  openClient(client: any, modal: any) {
    this.selectedClient = client;
    modal.present();
  }

  saveUser(modal: any, button: any) {
    button.disabled = true;
    this.saveUserButton = true;
    this.users.updateUser(this.selectedUser).subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        modal.dismiss();
        this.isToastOpen = true;
        this.toastColor = 'success';
        this.toastMessage = 'Usuário atualizado com sucesso!';
        button.disabled = false;
        this.saveUserButton = false;
      } else {
        this.isToastOpen = true;
        this.toastColor = 'danger';
        this.toastMessage = 'Erro ao atualizar o usuário!';
        button.disabled = false;
        this.saveUserButton = false;
      }
    }, (error: HttpErrorResponse) => {
      this.isToastOpen = true;
      this.toastColor = 'danger';
      this.toastMessage = 'Erro ao atualizar o usuário!';
      button.disabled = false;
      this.saveUserButton = false;
    })

    this.refreshUsers(null);

  }

  createUser(modal: any) {

  }

  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

}
