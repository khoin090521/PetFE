import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
// import {FormsModule} from '@angular/forms'
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
registerLocaleData(localeIt);
import { MatInputModule } from '@angular/material/input';
import { HomeCustomerComponent } from './home-customer/home-customer.component';
import { DetailPetComponent } from './detail-pet/detail-pet.component';
import {MatTableModule} from '@angular/material/table';
import { CustomerBookingComponent } from './customer-booking/customer-booking.component';
import { CalendarModule, DateAdapter, MOMENT } from 'angular-calendar';
import { SchedulerModule, CalendarSchedulerUtils } from 'angular-calendar-scheduler';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AppService } from './service/app.service';
import * as moment from 'moment';
// import { MatFormFieldModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatDoctorComponent } from './chat-doctor/chat-doctor.component';
import { ChatComponent } from './component/chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    HomeCustomerComponent,
    DetailPetComponent,
    CustomerBookingComponent,
    ChatDoctorComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatTableModule,
    HttpClientModule,
    MatIconModule,
    MatFormFieldModule,
    ModalModule.forRoot(),
    CalendarModule.forRoot({provide: DateAdapter, useFactory: adapterFactory,}),
    SchedulerModule.forRoot({ locale: 'en', headerDateFormat: 'daysRange' }),
  ],
  providers: [
    BsModalService,
    AppService,
    { provide: LOCALE_ID, useValue: 'en-US' },//vi-VN
    { provide: MOMENT, useValue: moment }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
