import { Component, AfterViewInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
    templateUrl: './myapplications.component.html'
})
export class MyapplicationsComponent {


    public data = {};
    public myapplications;
    user:any;

    constructor(private httpService: HttpService, private userService: UserService, private router: Router) {
        this.userService.user.subscribe(user => {
            this.user = user;

            if (user != false && user.id) {
                this.data['seekerid'] = this.user.id;
                this.httpService.request('myapplications', this.data).subscribe(result => {
                    if (result.success) {
                        console.log(result);
                        this.myapplications = result.applications;
                    }
                    else {
                        alert('hiba');
                    }
                });
            }
        });


    }


}
