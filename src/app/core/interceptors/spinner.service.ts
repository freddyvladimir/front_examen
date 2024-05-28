import { Injectable } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor(private spinner: NgxSpinnerService) { }
  public loading(){
    this.spinner.show();
  }
  public loadingClose(){
    this.spinner.hide();
  }
}
