import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, IonInput, IonSearchbar } from '@ionic/angular';
import { UsersService } from 'src/app/users.service';
import { MaskitoOptions, MaskitoElementPredicate, maskitoTransform } from '@maskito/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  @ViewChild('ionInputEl', { static: true }) ionInputEl!: IonInput;

  inputModel = '';

  public usersList: any[] = [];
  public userQuery: any[] = [];

  public tempClientList: any[] = [];
  public tempClientQuery: any[] = [];

  //PARAMETROS PARA FITLRO
  public user: string | null = null;
  public email: string | null = null;
  public aniversary: Boolean | null = null;
  public activeUser: Boolean | null = null;
  public phone: string | null = null;
  public anualBonus: Boolean | null = null;
  public role: number | null = null;
  public cpf: string | null = null;

  public defaultDate: string = new Date('1950, 01, 01').toISOString();

  public roles: any = [
    { id: 1, name: 'ROLE_ADMIN' },
    { id: 2, name: 'ROLE_EMPLOYEE' },
    { id: 3, name: 'ROLE_MEMBER' },
    { id: 4, name: 'ROLE_ADMIN-EMPLOYEE' }
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
  public newUser: any = {
    user: '',
    password: '',
    email: '',
    client: {
      name: '',
      birthDate: new Date().toISOString(),
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
  public addBirthdate: string = new Date().toISOString();
  public loadError: boolean = false;

  public currentRole: string = '0';
  public currentBonus: string = '';
  public bonusExpiration: string = new Date().toISOString();
  public bonusReason: string = '';

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
      this.loadError = true;
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
      this.loadError = true;
    });

  }

  openAddModal(modal: any) {
    this.newUser = {
      user: '',
      password: '',
      email: '',
      client: {
        name: '',
        birthDate: new Date().toISOString(),
        phone: '',
        anualBonus: false,
        plano: {
          id: 1
        },
        cpf: '',
      }
    }
    modal.present();
  }

  saveClient(clientModal: any, addModal: any) {
    this.newUser = {
      user: '',
      password: '',
      email: '',
      client: {
        name: '',
        birthDate: new Date().toISOString(),
        phone: '',
        anualBonus: false,
        plano: {
          id: 1
        },
        cpf: '',
      }
    }
    this.newUser.client.name = this.selectedClient.name;
    this.newUser.client.telephone = this.selectedClient.telephone;
    clientModal.dismiss();
    addModal.present();
  }

  filterUser(event: any) {
    const value = event.target!.value;
    const filteredValue = value.replace(/[^a-zA-Z0-9]+/g, '');
    this.ionInputEl.value = this.inputModel = filteredValue;
  }

  filterOnlyString(event: any) {
    const value = event.target!.value;

    const filteredValue = value.replace(/[^a-zA-Z]+/g, '');

    this.ionInputEl.value = this.inputModel = filteredValue;
  }

  changeBonusType(event: any) {
    this.currentBonus = event.detail.value
  }

  handleBonusDismiss(modal: any) {
    this.currentBonus = '';
    this.bonusExpiration = new Date().toISOString();
    modal.dismiss();
  }

  applyBonus(modal: any) {
    this.selectedUser.client.anualBonus = 'true';
    this.selectedUser.client.bonus = {
      expire_date: this.bonusExpiration,
      bonus_type: this.currentBonus,
      other_reason: this.bonusReason
    }
    modal.dismiss();
  }

  searchUser(event: any) {
    let query: string = ''
    if (event != null) {
      query = event.target.value.toLowerCase();
    }

    this.userQuery = this.usersList.filter(user => {
      const nameMatch = user.client.name.toLowerCase().indexOf(query) > -1;
      const phoneMatch = this.phone == null || user.client.telephone?.indexOf(this.phone) > -1;
      const emailMatch = this.email == null || user.email?.indexOf(this.email) > -1;
      const activeMatch = this.activeUser == null || user.client.active === this.activeUser;
      const annualBonusMatch = this.anualBonus == null || user.client.anualBonus === this.anualBonus;
      const birthDateMatch = this.aniversary == null ||
        (this.aniversary && user.client.birthDate != null &&
          new Date(new Date().getFullYear(), user.client.birthDate[1] - 1, user.client.birthDate[2]) >= new Date(new Date().getFullYear(), new Date().getMonth(), 1) && new Date(new Date().getFullYear(), user.client.birthDate[1] - 1, user.client.birthDate[2]) < new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1) || this.aniversary != true);
      const cpfMatch = this.cpf == null || user.client.cpf.indexOf(this.cpf) > -1;
      const userMatch = this.user == null || user.user.indexOf(this.user) > -1;

      return nameMatch && phoneMatch && emailMatch && activeMatch && annualBonusMatch && birthDateMatch && cpfMatch && userMatch;
    });

    this.tempClientQuery = this.tempClientList.filter(client => {
      const nameMatch = client.name.toLowerCase().indexOf(query.toLowerCase()) > -1 && !this.aniversary && !this.anualBonus && !this.email && !this.cpf && !this.user;
      const phoneMatch = this.phone == null || client.telephone?.indexOf(this.phone) > -1 && !this.aniversary && !this.anualBonus && !this.email && !this.cpf && !this.user;
      const activeMatch = this.activeUser == null || client.active === this.activeUser && !this.aniversary && !this.anualBonus && !this.email && !this.cpf && !this.user;

      return nameMatch && phoneMatch && activeMatch;
    });

    this.alphabeticalOrder();
    this.alphabeticalOrderTempClients();

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

    this.resetFilter(null);

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

  applyFilter(modal: any) {
    this.searchUser(null)
    modal.dismiss();
  }

  applyRole(role: string, modal: any) {
    this.selectedUser.role[0] = this.roles[parseInt(role)];
    modal.dismiss();
  }

  onRoleChange(event: any) {
    this.currentRole = event.detail.value;
  }

  resetFilter(modal: any) {
    this.user = null;
    this.email = null;
    this.phone = null;
    this.cpf = null;
    this.anualBonus = null;
    this.aniversary = null;
    this.activeUser = null;
    this.role = null;
    this.searchUser(null);
    modal.dismiss();
  }

  openUser(user: any, modal: any) {
    this.selectedUser = user;
    if (user.client.birthDate != null) {
      this.birthDate = new Date(this.selectedUser.client.birthDate[0], this.selectedUser.client.birthDate[1] - 1, this.selectedUser.client.birthDate[2]).toISOString();
    } else {
      this.birthDate = '';
    }
    this.currentRole = (user.role[0].id - 1).toString();
    console.log(this.currentRole);

    modal.present();
  }

  async deleteUser(user: any, modal: any) {
    this.saveUserButton = true;
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
          this.saveUserButton = false;
          this.isToastOpen = true;
          this.toastColor = 'success';
          this.toastMessage = 'cliente excluído com sucesso!';
          this.refreshUsers(null);
          modal.dismiss();
        }
      }, (error) => {
        this.saveUserButton = false;
        this.isToastOpen = true;
        this.toastColor = 'danger';
        this.toastMessage = 'Erro ao excluir o cliente! - '+error.message;
        modal.dismiss();
      })
    }else{
      this.saveUserButton = false;
    }
  }

  async deleteClient(client: any, modal: any) {
    this.saveUserButton = true
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
          this.saveUserButton = false
        } else {
          this.isToastOpen = true;
          this.toastColor = 'danger';
          this.toastMessage = 'Erro ao excluir o cliente!';
          modal.dismiss();
          this.saveUserButton = false
        }
      }, (error) => {
        this.isToastOpen = true;
        this.toastColor = 'danger';
        this.toastMessage = 'Erro ao excluir o cliente!';
        modal.dismiss();
        this.saveUserButton = false
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
    if (this.birthDate != '' && this.selectedUser.client.birthDate != null) {
      this.selectedUser.client.birthDate[0] = new Date(this.birthDate).getFullYear();
      this.selectedUser.client.birthDate[1] = new Date(this.birthDate).getMonth() + 1;
      this.selectedUser.client.birthDate[2] = new Date(this.birthDate).getDate();
    } else if (this.selectedUser.client.birthDate == null) {
      this.selectedUser.client.birthDate = [new Date(this.birthDate).getFullYear(), new Date(this.birthDate).getMonth() + 1, new Date(this.birthDate).getDate()];
    }
    else {
      this.selectedUser.client.birthDate = this.birthDate;
    }
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
    this.saveUserButton = true;
    this.users.createUser(this.newUser).subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        modal.dismiss();
        this.saveUserButton = false;
        this.isToastOpen = true;
        this.toastColor = 'success';
        this.toastMessage = 'Usuário criado com sucesso!';
        this.refreshUsers(null);
        this.newUser = {
          user: '',
          password: '',
          email: '',
          client: {
            name: '',
            birthDate: new Date().toISOString(),
            phone: '',
            anualBonus: false,
            plano: {
              id: 1
            },
            cpf: '',
          }
        };
      }
    }, (error) => {
      if (error.status == 409) {
        this.saveUserButton = false;
        this.toastColor = 'primary';
        this.toastMessage = 'Erro ao criar o usuário: Dados obrigatórios faltantes!';
        this.isToastOpen = true;
      } else {
        this.saveUserButton = false;
        this.toastColor = 'danger';
        this.toastMessage = 'Erro ao criar o usuário! - ' + error.message;
        this.isToastOpen = true;
      }

    })
  }

  setToastOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

}
