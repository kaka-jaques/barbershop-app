import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  public usersList: any[] = [];
  public userQuery: any[] = [];

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

  public selectedUser: any = {
    client: {
      name: 'Nan'
    }
  };
  public birthDate!: string;

  constructor(private users: UsersService) { }

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
    });
  }

  alphabeticalOrder() {
    this.userQuery.sort((a, b) => {
      if (a.client.name < b.client.name) return -1;
      if (a.client.name > b.client.name) return 1;
      return 0;
    });
  }

  applyFilter(){
    
  }

  resetFilter(modal: any){
    modal.dismiss();
  }

  openUser(user: any, modal: any){
    this.selectedUser = user;
    if(user.client.birthDate != null){
      this.birthDate = new Date(this.selectedUser.client.birthDate[0], this.selectedUser.client.birthDate[1] - 1, this.selectedUser.client.birthDate[2]).toISOString();
    }else{
      this.birthDate = '';
    }
    modal.present();
  }

}
