import { Component } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app',
  templateUrl: './app.component.html'
})
export class AppComponent {
  clientHeight = window.innerHeight;
  public loaded = false;
  constructor(private httpService:HttpService){
    this.httpService.loaded.subscribe(loaded=>{
      this.loaded = loaded;
    });
  }
}
