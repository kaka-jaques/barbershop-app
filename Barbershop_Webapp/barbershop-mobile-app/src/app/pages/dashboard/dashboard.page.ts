import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as ProgressBar from 'progressbar.js';
import { BillService } from 'src/app/bill.service';
import { BookService } from 'src/app/book.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardPage implements OnInit {

  loading:boolean = true;
  changeLoading:boolean = false;
  viewToggle:boolean = false;

  profitChart = 0.4
  dueChart = 0.25
  billChart = 0.35



  constructor(private bill:BillService, private book:BookService) { }

  ngOnInit() {

    var dueBar = new ProgressBar.Circle('#yellow-circle',{
      strokeWidth: 6,
      easing: 'easeInOut',
      duration: 1000,
      color: '#ffd256',
      trailColor: 'transparent',
      svgStyle: null
    })

    var profitBar = new ProgressBar.Circle('#blue-circle',{
      strokeWidth: 6,
      easing: 'easeInOut',
      duration: 1000,
      color: '#0aa0f7',
      trailColor: 'transparent',
      svgStyle: null
    })

    var billBar = new ProgressBar.Circle('#red-circle',{
      strokeWidth: 6,
      easing: 'easeInOut',
      duration: 1000,
      color: '#e72d2d',
      trailColor: 'transparent',
      svgStyle: null
    })

    billBar.animate(this.billChart);
    dueBar.animate(this.dueChart + this.billChart);
    profitBar.animate(this.profitChart + this.dueChart + this.billChart);

  }

}
