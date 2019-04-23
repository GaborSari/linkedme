import { Component, AfterViewInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { UserService } from 'src/app/services/user.service';

declare var $: any;

@Component({
  selector: 'login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements AfterViewInit {


  public data = {};
  user = {success:false};

  public sent = false;
  constructor(private httpService:HttpService,private userService:UserService) {
  }


  ngAfterViewInit() {
    $('.ui.checkbox').checkbox();
  }

  login(){
    this.httpService.request("login",this.data).subscribe(result=>{
      this.sent = true;
      this.userService.user.next(result);
      this.user = result;
    });
  }
}
