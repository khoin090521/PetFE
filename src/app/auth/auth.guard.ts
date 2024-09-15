import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../_services/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private toastService: ToastrService
  ) {}

  canActivate(): boolean {
    const token = this.tokenService.getAccessToken();

    if (!token) {
      this.toastService.error('Bạn cần đăng nhập');
      this.router.navigateByUrl('/');
      return false;
    }

    const tokenPayload = this.tokenService.decodeToken(token);

    if (Date.now() >= tokenPayload.exp * 1000) {
      this.toastService.error('Bạn cần đăng nhập');
      this.router.navigateByUrl('/');
      return false;
    }

    return true;
  }
}