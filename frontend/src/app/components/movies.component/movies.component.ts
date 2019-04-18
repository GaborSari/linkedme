import { Component, HostListener } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { Movie } from 'src/app/models/Movie';
import { NotificationService } from 'src/app/services/notification.service';


@Component({
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent {

  public cardClass = "ui floated four cards";
  public movies: Array<Movie> = new Array<Movie>();
  private pageIndex = 1;
  private year = new Date().getFullYear();
  public loaded = false;
  public searchInput = "";

  constructor(private movieService: MovieService,private notificationService:NotificationService) {
    this.loadMovies(this.year, this.pageIndex);
    if (window.innerWidth <= 768) {
      this.cardClass = "ui floated two cards";
    }
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    if (this.searchInput != "" || this.pageIndex > 3) return;
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight - 50;
    if (pos >= max) {
      this.pageIndex++;
      this.loadMovies(this.year, this.pageIndex);
    }
  }

  loadMovies(year: number, pageIndex: number) {
    this.loaded = false;
    this.movieService.getPopularMovies(year, pageIndex).subscribe(movies => {
      if (movies.length > 0) {
        for (let movie of movies) {
          this.movies.push(movie);
        }
        this.loaded = true;
      }
    });
  }

  searchMovies() {
    this.loaded = false;
    this.movieService.searchMovie(this.searchInput).subscribe(movies => {
      this.movies = new Array<Movie>();
      if (movies.length > 0) {
        for (let movie of movies) {
          this.movies.push(movie);
        }
        this.loaded = true;
      }
    });
  }

  clearSearch(){
    this.searchInput = "";
    this.pageIndex = 1;
    this.movies = new Array<Movie>();
    this.loadMovies(this.year, this.pageIndex);
  }


  notify(movie:Movie){
    let notificationOptions:NotificationOptions;

    this.notificationService.add(movie.title);
  }
}
