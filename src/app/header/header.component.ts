import { Component, OnInit, ViewChild, TemplateRef, NgZone, ElementRef, HostListener, Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AuthService, UserRole } from '../_services/auth.service';
import { TokenService } from '../_services/token.service'; 
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BASE_URL } from '../_common/constants/api';
import { Observable, catchError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Md5 } from 'ts-md5';

export class UserProfile {
  private gmail: any;
  private full_name: any;
  private password: any;
  private address: any;
  private phone_number: any;

  constructor(full_name: any, gmail: any, address: any, phone_number: any) {
    this.gmail = gmail;
    this.full_name = full_name;
    this.address = address;
    this.phone_number = phone_number;
  }
}

export class UserRegister{
  private gmail: any;
  private full_name: any;
  private password: any;
  private address: any;
  private phone_number: any;

  constructor(full_name: any, gmail: any, password: any, address: any, phone_number: any) {
    this.gmail = gmail;
    this.full_name = full_name;
    this.password = password;
    this.address = address;
    this.phone_number = phone_number;
  }
}

export class Password {
  private oldPassword: any;
  private newPassword: any;
  private resetPassword: any;

  constructor(oldPassword: any, newPassword: any, resetPassword: any) {
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
    this.resetPassword = resetPassword;
  }
}

interface SearchResult {
  gmail: string;
  full_name: string;
  address: string;
  phone_number: string;
  roles: string[];
  status: number;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
@Injectable({
  providedIn: 'root'
})
export class HeaderComponent implements OnInit{

  modalRef?: BsModalRef;
  registerStatus: any = false;
  forgotPasswordStatus: boolean = false;
  userProfile?: any;
  formLogin!: FormGroup;
  username: any;
  openProfile: boolean = false;
  openChange: boolean = false;
  openFormProfile: boolean = false;
  gmail: string = "";
  gmailInfor: any = "";
  nameInfor: any = "";
  phoneInfor: any = "";
  address: any = "";
  public userProfileInfor?: UserProfile;
  public userRegister?: UserRegister;
  public password?: Password;
  oldPassword: any = "";
  newPassword: any = "";
  retypePassword: any = "";
  searchName: any = "";

  gmailRegister: any = "";
  fullnameRegister: any = "";
  passwordRegister: any = "";
  addressRegister: any = "";
  phoneRegister: any = "";
  sms: any = "";
  hashSMS: any = "";

  searchResults?: SearchResult[] | null;
  clinicList: any;
 
  
  constructor(
    private modalService: BsModalService,
    private authService: AuthService,
    private tokenService: TokenService,
    private ngZone: NgZone,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastService: ToastrService,
    private http: HttpClient,
    private md5: Md5
  ){
    this.userProfileInfor = new UserProfile(this.nameInfor, this.gmailInfor, this.address, this.phoneInfor);
    this.password = new Password(this.oldPassword, this.newPassword, this.retypePassword);
    this.userRegister = new UserRegister(this.fullnameRegister, this.gmailRegister, this.passwordRegister, this.addressRegister, this.phoneRegister);
  }

  user_role: any = "";

  ngOnInit(): void {
    this.user_role = localStorage.getItem('user_role');
    this.username = this.tokenService.getUserProfile();
    this.formLogin = this.formBuilder.group({
      gmail: [null, []],
      password: [null, []],
    });
    this.getClinic();
  }


  getClinic(){
    //https://petapi.developvn.click/api/search/clinic?search=a
    this.http.get<any>(`${BASE_URL}/auth/listAllClinic`).subscribe(
      (res) => {
        this.clinicList = res.data;
      },
      (err) => {
        
      }
    );
  }

  onClinicClick(clinic: any) {
    this.modalRef?.hide();
    const navigationExtras: NavigationExtras = {
      queryParams: { clinicId: clinic.id, clinicName: clinic.name }
    };
    this.router.navigate(['/customer-booking'], navigationExtras);
  }


  openLoginForm(templateLogin: TemplateRef<any>, templateLogout: TemplateRef<any>) {
    if(!this.tokenService.getUserProfile()){
      this.registerStatus = false;
      this.forgotPasswordStatus = false;
      this.modalRef = this.modalService.show(templateLogin);
    }else{
      this.openProfile = false;
      this.registerStatus = false;
      this.forgotPasswordStatus = false;
      this.openChange = false;
      this.openProfile = false;
      this.openFormProfile = false;
      this.modalRef = this.modalService.show(templateLogout);
    }
  }

  onLogout() {
    this.tokenService.doLogout();
    this.userProfile = undefined;
    this.modalRef?.hide();
    this.username = null;
    this.toastService.success('Đăng xuất thành công');
    this.router.navigateByUrl('/');
  }

  closeDialog(){
    this.modalRef?.hide();
  }

  closeLogout(){
    this.modalRef?.hide();
  }

  openRegisterForm(){
    this.registerStatus = true;
  }

  async registerAccount() {
    this.userRegister = new UserRegister(
      this.fullnameRegister,
      this.gmailRegister,
      this.passwordRegister,
      this.addressRegister,
      this.phoneRegister
    );
  
    this.sendRegister(this.userRegister).subscribe(
      (res) => {
        this.hashSMS = Md5.hashStr("password");
        console.log("res",JSON.stringify(res.code));
        console.log("hash",this.hashSMS);
        this.toastService.success('Đã gửi mã xác nhận đến email của bạn');
      },
      (err) => {  
        if (err.status === 400) {
          this.toastService.error('Yêu cầu không hợp lệ');
        } else if (err.status === 500) {
          this.toastService.error('Lỗi hệ thống');
        } else {
          this.toastService.success('Gửi mã xác nhận thành công');
        }
      }
    );
  }

  verifySMS(){
    console.log("Md5.hashStr(this.sms)",Md5.hashStr(this.sms));
    console.log("this.hashSMS",this.hashSMS);
    
  }
  

  sendRegister(userRegister: UserRegister): Observable<any> {
    return this.http.post<any>(`https://petapi.developvn.click/api/auth/register`, userRegister);
  }

  findAccount(){
    this.forgotPasswordStatus = true;
    this.registerStatus = null;
  }

  closeLoginForm() {
    this.forgotPasswordStatus = false;
    this.registerStatus = null;
    // this.modalRef?.hide();
  }

  onLogin() {
    const values = this.formLogin.getRawValue();
    
    this.authService.login(values).subscribe(
      (res) => {  
        const accessToken = res.token;
        const decodedToken = this.tokenService.decodeToken(res.token);
  
        this.tokenService.saveAccessToken(accessToken);
        this.tokenService.saveRole(res.roles);
        this.tokenService.saveUserId(res.id);
        this.tokenService.saveClinicId(res.clinic_id);
        this.userProfile = decodedToken.sub; // Access data from decodedToken
        this.tokenService.saveUserProfile(this.userProfile);
  
        this.formLogin.reset();
        this.modalRef?.hide();
        this.toastService.success('Đăng nhập thành công');
        this.router.navigateByUrl(this.getRedirectURLbyRole(res.roles as UserRole));
      },
      (err) => {
        this.toastService.error('Đăng nhập thất bại');
      }
    );
  }

  getRedirectURLbyRole(role: UserRole) {
    switch (role[0]) {
      case UserRole.ROLE_ADMIN:
        return '/admin-manager';
      case UserRole.ROLE_HOST:
        return '/create-doctor';
      case UserRole.ROLE_USER:
        return '/home-customer';
      case UserRole.ROLE_DOCTOR:
        return 'chat-doctor/:userId';
      default:
        return '/';
    }
  }

  openMyProfile(){
    // this.username = this.tokenService.getUserProfile();
    this.openFormProfile = true;
    this.openProfile = true;
    this.authService.getProfile().subscribe(
      (res) => {  
        console.log("???",res.gmail);
        this.gmailInfor = res.gmail;
        this.nameInfor = res.full_name;
        this.address = res.address;
        this.phoneInfor = res.phone_number;
      }
    );
  }

  openChangePassword(){
    this.openChange = true;
    this.openProfile = true;
  }

  sendSMS(){
    this.authService.sendSMS(this.gmail).subscribe(
      (res) => {   
        
      }
    );
  }

  updateProfile(){
    this.userProfileInfor = new UserProfile(this.nameInfor, this.gmailInfor, this.address, this.phoneInfor);
    this.changeProfile(this.userProfileInfor).subscribe(
      (res) => {  
        this.toastService.success('Cập nhật thông tin thành công');
        this.modalRef?.hide();
      },
      (err) => {
        this.toastService.success('Cập nhật thông tin thành công');
      }
    );
    this.authService.getProfile().subscribe(
      (res) => {  
        console.log("???",res.gmail);
        this.gmailInfor = res.gmail;
        this.nameInfor = res.full_name;
        this.address = res.address;
        this.phoneInfor = res.phone_number;
      }
    );
    this.modalRef?.hide();
  }

  changeProfile(userProfileInfor: UserProfile): Observable<any>{
    return this.http.post<any>(`${BASE_URL}/auth/update-profile`, userProfileInfor);
  }

  async updatePassword(){
    this.password = new Password(this.oldPassword, this.newPassword, this.retypePassword);
    this.http.post<any>(`${BASE_URL}/auth/change-password`, this.password).subscribe(
      (res) => {},
      (err) => {
        if(err.status === 200){
          this.toastService.success('Đổi mật khẩu thành công');
        }else{
          this.toastService.error('Đổi mật khẩu thất bại');
        }
        this.modalRef?.hide();
      }
    );
    this.oldPassword = "";
    this.newPassword = "";
    this.retypePassword = "";
  }

  redirectToBooking(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
  }

}
