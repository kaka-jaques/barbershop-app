import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public notifysData: any = {1: 'item 1'};
  public notifysCont:string = this.notifysData.length;

  constructor(private route: Router) { }

  ngOnInit() {

    if(this.notifysData.length == 0){
      console.log("init home");
    }

  }

}
