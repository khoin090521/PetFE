import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminManagerComponent } from './admin-manager/admin-manager.component';
import { ChatDoctorComponent } from './chat-doctor/chat-doctor.component';
import { ChatComponent } from './component/chat/chat.component';
import { CreateDoctorComponent } from './create-doctor/create-doctor.component';
import { CustomerBookingComponent } from './customer-booking/customer-booking.component';
import { DetailPetComponent } from './detail-pet/detail-pet.component';
import { HomeCustomerComponent } from './home-customer/home-customer.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '',  component: HomeComponent},
  { path: 'home',  component: HomeComponent},
  { path: 'home-customer',  component: HomeCustomerComponent},
  { path: 'detail-pet',  component: DetailPetComponent},
  { path: 'customer-booking',  component: CustomerBookingComponent},
  { path: 'chat-doctor/:userId',  component: ChatDoctorComponent},
  { path: 'chat-doctor/:userId',  component: ChatComponent},
  { path: 'create-doctor',  component: CreateDoctorComponent},
  { path: 'admin-manager',  component: AdminManagerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
