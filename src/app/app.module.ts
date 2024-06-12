import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UserInformationComponent } from './user-information/user-information.component';

@NgModule({
  declarations: [
    UserInformationComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
  ],
  providers: [],
  bootstrap: [UserInformationComponent]
})
export class AppModule { }
