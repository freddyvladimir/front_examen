import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PreloaderService } from '@core';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>
  
  
  <ngx-spinner bdColor = "rgba(0, 0, 0, 0.8)" size = "default" color = "#fff" type = "square-jelly-box" [fullScreen] = "false" template = "<div> <img src='../../../assets/images/salud.gif'> </div>"><p style="color: white" > Loading... </p></ngx-spinner>  
  `,
})
export class AppComponent implements OnInit, AfterViewInit {
  constructor(private preloader: PreloaderService) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.preloader.hide();
  }
}
