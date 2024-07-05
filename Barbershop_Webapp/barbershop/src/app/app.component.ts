import { Component } from '@angular/core';
import { gsap } from 'gsap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})



export class AppComponent {
  title = 'barbershop';

  lateralPos:number = 0;
  navPos:number = 0;
  textOpacity:number = 1;
  mainOpacity:string = 'rgba(63, 63, 63, 0.7)';

  constructor(private router: Router) {}

  ngOnInit() {
    gsap.to('#lateral-nav',{
      x: -160
    })
    gsap.to('.nav-option',{
      x: 160,
      width: 50
    })
    gsap.to('.text', {
      opacity: 0,
      display: 'none'
    })
  }

  navMenu() {
    gsap.to('#lateral-nav',{
      x: this.lateralPos
    })
    gsap.to('.nav-option',{
      x: this.navPos
    })
    gsap.to('.text', {
      display: 'block',
      opacity: this.textOpacity,
    })
    gsap.to('main', {
      backgroundColor: this.mainOpacity
    })

    if(this.lateralPos == 0) {
      this.lateralPos = -160;
      this.navPos = 160;
      this.textOpacity = 0;
      this.mainOpacity = 'transparent';
    } else {
      this.lateralPos = 0;
      this.navPos = 0;
      this.textOpacity = 1;
      this.mainOpacity = 'rgba(63, 63, 63, 0.7)';
      gsap.to('.text', {
        display: 'none'
      })
    }

  }

  postCloseMenu(){

    if(this.lateralPos == -160) {
      this.navMenu();
    }

  }

}
