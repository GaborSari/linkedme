import { Component, AfterViewInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent {

  sum: any;
  constructor(private httpService: HttpService, private userService: UserService) {
    this.httpService.request('sum').subscribe(tag => {
      this.sum = tag;
    });
  }

}
