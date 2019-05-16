import { Component, AfterViewInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { UserService } from 'src/app/services/user.service';


declare var $: any;

@Component({
  templateUrl: './jobs.component.html'
})
export class JobsComponent {
  data = {};
  user: any;
  search = "";
  comment = "Comment";
  tagtable: any;
  jobs = new Array<any>();
  constructor(private httpService: HttpService, private userService: UserService) {
    this.userService.user.subscribe(user => {
      this.user = user;
      if(user.isCompany){
        this.httpService.request('tagtable').subscribe(tag => {
          this.tagtable = tag;
        });
      }
    });
    this.httpService.request('listJobs').subscribe(jobs => {
      this.jobs = jobs;
    });
  }



  addJob() {
    this.data['companyid'] = this.user.id;
    this.httpService.request('addJob', this.data).subscribe(result => {
      if (result.success) {
        alert('sikeresen hozzáadva');
        this.httpService.request('listJobs').subscribe(jobs => {

          this.jobs = new Array<any>();
          this.jobs = jobs;
        });
      }
      else {
        alert('hiba');
      }
    })
  }


  showApplicationModal(id) {
    this.data['jobid'] = id;
    $('.ui.application.modal')
      .modal('show');
  }

  application() {
    this.data['seekerid'] = this.user.id;
    this.data['comment'] = this.comment;
    this.httpService.request('application', this.data).subscribe(result => {
      if (result.success) {
        alert('sikeresen hozzáadva');
        this.httpService.request('listJobs').subscribe(jobs => {

          this.jobs = new Array<any>();
          this.jobs = jobs;
        });
      }
      else {
        alert('hiba');
      }
    })

    
  }

  deleteJob(id){
    this.data['jobid'] = id;
    this.httpService.request('deletejob', this.data).subscribe(result => {
      if (result.success) {
        alert('sikeresen törölve');
        this.httpService.request('listJobs').subscribe(jobs => {

          this.jobs = new Array<any>();
          this.jobs = jobs;
        });
      }
      else {
        alert('hiba');
      }
    })
  }

  searchbytags(){
    let jobs = new Array<any>();


    for(let job of this.jobs){
      if(job.tags.indexOf(this.search) > -1){
        jobs.push(job);
      }
    }

    this.jobs = jobs;
  }

}
