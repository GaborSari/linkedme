import { Component, AfterViewInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
    templateUrl: './incomingapplications.component.html'
})
export class IncomingapplicationsComponent {


    public data = {};
    public incomingapplications;
    user: any;

    constructor(private httpService: HttpService, private userService: UserService, private router: Router) {
        this.userService.user.subscribe(user => {
            this.user = user;
            this.data["companyid"] = this.user.id;
            if (user != false && user.id) {
                this.httpService.request("incomingapplications", this.data).subscribe(x => {
                    if (x.success) {
                        this.incomingapplications = x.applications;
                    }
                })
            }
        });
    }

    approve(appid) {
        this.data["application"] = appid;
        this.data["status"] = 1;
        this.httpService.request("decideapplication", this.data).subscribe(result => {
            if (result.success) {
                alert('Sikeresen elfogadva');
            }
            else {
                alert('hiba');
            }
        });

    }



    deny(appid) {
        this.data["application"] = appid;
        this.data["status"] = 0;
        this.httpService.request("decideapplication", this.data).subscribe(result => {
            if (result.success) {
                alert('Sikeresen elutasítva');
            }
            else {
                alert('hiba');
            }
        });

    }



}
