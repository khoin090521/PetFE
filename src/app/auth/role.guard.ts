import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../_services/token.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private toastService: ToastrService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const role: string = route.data['role'];
    const userRole = this.tokenService.getUserRole();
    const hasAccess = userRole && userRole === role;

    if (!hasAccess) {
      this.toastService.error('Không thể truy cập');
      this.router.navigateByUrl('/');
      return false;
    }
  
    return true;
  }
}