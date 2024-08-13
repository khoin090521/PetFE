import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { UserProfile } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  saveAccessToken(accessToken: string) {
    localStorage.setItem('access_token', accessToken);
  }

  saveRole(role: string) {
    localStorage.setItem('user_role', role);
  }

  saveUserId(userId: any){
    localStorage.setItem('user_id', userId);
  }
  
  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  getUserRole() {
    return localStorage.getItem('user_role');
  }

  saveUserProfile(userProfile: UserProfile | undefined) {
    localStorage.setItem('user_profile', JSON.stringify(userProfile));
  }

  getUserProfile(): UserProfile | undefined {
    const json = localStorage.getItem('user_profile');
    return json ? JSON.parse(json) : undefined;
  }

  decodeToken(token: string) {
    const payload = jwtDecode(token) as any;
    return payload;
  }

  doLogout() {
    ['access_token', 'user_profile', 'user_role'].forEach(key => localStorage.removeItem(key));
  }
}