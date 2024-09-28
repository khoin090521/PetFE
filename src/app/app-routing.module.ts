import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminManagerComponent } from './admin-manager/admin-manager.component';
import { ChatDoctorComponent } from './chat-doctor/chat-doctor.component';
import { ChatComponent } from './component/chat/chat.component';
import { CreateDoctorComponent } from './create-doctor/create-doctor.component';
import { ServiceManagerComponent } from './service-manager/service-manager.component';
import { CustomerBookingComponent } from './customer-booking/customer-booking.component';
import { DetailPetComponent } from './detail-pet/detail-pet.component';
import { HomeCustomerComponent } from './home-customer/home-customer.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { RoleGuard } from './auth/role.guard';
import { UserRole } from './_services/auth.service';
import { CustomerServiceComponent } from './customer-service/customer-service.component';
import { DoctorServiceComponent } from './doctor-service/doctor-service.component';

const routes: Routes = [
  { path: '',  component: HomeComponent},
  { 
    path: 'home',  component: HomeComponent,
  },
  { 
    path: 'home-customer',  component: HomeCustomerComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      role: UserRole.ROLE_USER,
    },
  },
  {
    path: 'detail-pet',  component: DetailPetComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      role: UserRole.ROLE_USER,
    },
  },
  {
    path: 'customer-booking',  component: CustomerBookingComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      role: UserRole.ROLE_USER,
    },
  },
  {
    path: 'customer-booking?clinicId=&clinicName=',  component: CustomerBookingComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      role: UserRole.ROLE_USER,
    },
  },
  { 
    path: 'chat-doctor/:userId',  component: ChatDoctorComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      role: UserRole.ROLE_DOCTOR,
    },
  },
  { 
    path: 'customer-service/:recordId',  component: CustomerServiceComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      role: UserRole.ROLE_DOCTOR,
    },
  },
  { 
    path: 'my-service/:recordId',  component: CustomerServiceComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      role: UserRole.ROLE_USER,
    },
  },
  { 
    path: 'create-doctor',  component: CreateDoctorComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      role: UserRole.ROLE_HOST,
    },
  },
  { 
    path: 'service-manager',  component: ServiceManagerComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      role: UserRole.ROLE_HOST,
    },
  },
  { 
    path: 'service-doctor',  component: DoctorServiceComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      role: UserRole.ROLE_HOST,
    },
  },
  { 
    path: 'admin-manager',  component: AdminManagerComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      role: UserRole.ROLE_ADMIN,
    },
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
