import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './components/app.component/app.component';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { HeaderComponent } from './components/header.component/header.component';
import { FooterComponent } from './components/footer.component/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './components/login.component/login.component';
import { RegistrationComponent } from './components/registration.component/registration.component';
import { HomeComponent } from './components/home.component/home.component';
import { JobsComponent } from './components/jobs.component/jobs.component';
import { MyapplicationsComponent } from './components/myapplications.component/myapplications.component';
import { IncomingapplicationsComponent } from './components/incomingapplications.component/incomingapplications.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegistrationComponent,
    HomeComponent,
    JobsComponent,
    MyapplicationsComponent,
    IncomingapplicationsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(APP_ROUTES),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
