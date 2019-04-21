import { Component, AfterViewInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

declare var $: any;

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements AfterViewInit {


  public data = {};

  constructor(private httpService:HttpService) {

  }


  ngAfterViewInit() {
    $('.ui.checkbox').checkbox();
  }

  login(){
    this.httpService.request("login",this.data).subscribe(result=>{
      console.log(result);
    });
  }
}
