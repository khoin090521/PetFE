import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailPetComponent } from './detail-pet/detail-pet.component';
import { HomeCustomerComponent } from './home-customer/home-customer.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '',  component: HomeComponent},
  { path: 'home',  component: HomeComponent},
  { path: 'home-customer',  component: HomeCustomerComponent},
  { path: 'detail-pet',  component: DetailPetComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
