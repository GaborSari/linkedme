import { Component, AfterViewInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  templateUrl: './jobs.component.html'
})
export class JobsComponent {


  constructor(private httpService:HttpService,private userService:UserService) {

  }

}
