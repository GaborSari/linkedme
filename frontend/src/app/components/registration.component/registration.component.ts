import { Component, HostListener, AfterViewInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

declare var $: any;

@Component({
  templateUrl: './registration.component.html'
})
export class RegistrationComponent implements AfterViewInit {

  public data = {};

  result = false;
  constructor(private httpService: HttpService) {

  }

  regist() {
    this.httpService.request("registration", this.data).subscribe(result => {
      if (result !== undefined) {
        this.result = result.success;
        $('.ui.modal').modal('show');
      }
    });
  }


  ngAfterViewInit() {
    $('.ui.checkbox').checkbox();
  }

}
