import { Component } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';

@Component({
  selector: 'app',
  templateUrl: './app.component.html'
})
export class AppComponent {
  clientHeight = window.innerHeight;
  public loaded = false;
  constructor(private movieService:MovieService){
    this.movieService.loaded.subscribe(loaded=>{
      this.loaded = loaded;
    });
  }
}
