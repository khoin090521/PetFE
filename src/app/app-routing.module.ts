import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeCustomerComponent } from './home-customer/home-customer.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '',  component: HomeComponent},
  { path: 'home',  component: HomeComponent},
  { path: 'home-customer',  component: HomeCustomerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
