import { Component, AfterViewInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  templateUrl: './jobs.component.html'
})
export class JobsComponent {
  data = {};
  user: any;


  jobs = new Array<any>();
  constructor(private httpService: HttpService, private userService: UserService) {
    this.userService.user.subscribe(user => {
      this.user = user;
    });
    this.httpService.request('listJobs').subscribe(jobs => {
      this.jobs = jobs;
    });
  }



  addJob() {
    this.data['companyUsername'] = this.user.username;
    this.httpService.request('addJob', this.data).subscribe(result => {
      if (result.success) {
        alert('sikeresen hozzáadva');
        this.httpService.request('listJobs').subscribe(jobs => {

          this.jobs = new Array<any>();
          this.jobs = jobs;
        });
      }
      else{
        alert('hiba');
      }
    })
  }

}
