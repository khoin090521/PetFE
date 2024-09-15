import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../_common/constants/api';
// import { Observable } from 'rxjs';
import { Observable, catchError } from 'rxjs';

export type LoginPayload = {
    gmail: string;
    password: string;
};

export type LoginResult = {
    token: string;
    role: string;
};

export type UserProfile = {
    sub: string;
};

export enum UserRole {
  ROLE_DOCTOR = 'doctor',
  ROLE_HOST = 'host',
  ROLE_ADMIN = 'admin',
  ROLE_USER = 'customer',
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(payload: LoginPayload): Observable<any> {
    return this.http.post<any>(`${BASE_URL}/auth/login`, payload);
  }

  sendSMS(gmail: string): Observable<any>{
    const url = `${BASE_URL}/auth/forgot-password?email=${gmail}`;
    return this.http.get<any>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error sending SMS:', error);
        throw error;
      })
    );
  }

  getProfile(): Observable<any>{
    const url = `${BASE_URL}/auth/profile`;
    return this.http.get<any>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error get profile:', error);
        throw error;
      })
    );
  }

}