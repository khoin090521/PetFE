import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
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

import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatDoctorComponent } from './chat-doctor/chat-doctor.component';
import { ChatComponent } from './component/chat/chat.component';
import { CreateDoctorComponent } from './create-doctor/create-doctor.component';
import { MatSelectModule } from '@angular/material/select';
import { AdminManagerComponent } from './admin-manager/admin-manager.component';
import { Md5 } from 'ts-md5';

import { MatListModule } from '@angular/material/list';


import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatProgressBarModule} from '@angular/material/progress-bar';


import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireStorageModule} from "@angular/fire/compat/storage";
import { environment } from 'src/environments/environments'; 

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
    CreateDoctorComponent,
    AdminManagerComponent,
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
    MatListModule,
    MatSelectModule,
    ModalModule.forRoot(),
    CalendarModule.forRoot({provide: DateAdapter, useFactory: adapterFactory,}),
    SchedulerModule.forRoot({ locale: 'en', headerDateFormat: 'daysRange' }),
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: false,
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ],
  providers: [
    Md5,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard,
    RoleGuard,
    BsModalService,
    AppService,
    { provide: LOCALE_ID, useValue: 'en-US' },
    { provide: MOMENT, useValue: moment },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
