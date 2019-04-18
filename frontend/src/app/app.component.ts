import { Component } from '@angular/core';
import { HttpService } from './services/http.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'linkedme';
  constructor(private httpService: HttpService) {

    this.httpService.loaded.subscribe(loaded => {
      if (loaded) {

        /*
        //expected: NOT FOUND
        this.httpService.request("undefinedWRONG").subscribe(x => {
          console.log(x);
        });
        */


        /*
        //expected: unset paramter
        this.httpService.request("test2").subscribe(x => {
          console.log(x);
        });
        */


        /*
        //expected: 404
        this.httpService.request("fail").subscribe(x => {
          console.log(x);
        });
        */



        /*
        //expected: NOT JSON
        let json = "{adasdas,sadsaasdas][Đ[}&@";
        this.httpService.request("test2",json).subscribe(x => {
          console.log(x);
        });
        */


        
        //expected: NOT JSON
        let json = '{ "name":"John", "age":30, "car":null }';
        this.httpService.request("test1",json).subscribe(x => {
          console.log(x);
        });
        
      }
    });



  }
}
