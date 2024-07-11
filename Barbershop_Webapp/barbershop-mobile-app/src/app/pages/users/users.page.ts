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

  constructor(private users: UsersService) { }

  async ngOnInit() {
    await this.users.getAllUsers().subscribe((response: HttpResponse<any>) => {
      if (response.ok) {
        this.usersList = response.body;
        this.userQuery = [...this.usersList];
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
    });

  }

  searchUser(event: any) {
    const query:string = event.target.value.toLowerCase();
    this.userQuery = this.usersList.filter(user => user.client.name.toLowerCase().indexOf(query) > -1);
  }

}
