import { Component, TemplateRef, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BASE_URL } from '../_common/constants/api';
import { Observable, catchError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


export interface PeriodicElement {
  full_name: string;
  gmail: string;
  phone: string;
  address: string;
  roles: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {full_name: 'Nguyễn Minh Nam', gmail: 'chien123@gmail.com', phone: '0123456789', address: 'HN', roles: 'Bác sĩ', status: 'Cấm'},
  {full_name: 'Nguyễn Minh Quang', gmail: 'chien123@gmail.com', phone: '0123456789', address: 'HN', roles: 'Bác sĩ', status: 'Cấm'},
  {full_name: 'Hydrogen', gmail: 'chien123@gmail.com', phone: '0123456789', address: 'HN', roles: 'Bác sĩ', status: 'Cấm'},
];

class Host{
  constructor(
    public gmail: string,
    public password: string,
    public full_name: string,
    public address: string,
    public phone_number: string,
    public name_clinic: string,
  ) {}
}


@Component({
  selector: 'app-admin-manager',
  templateUrl: './admin-manager.component.html',
  styleUrls: ['./admin-manager.component.scss']
})
export class AdminManagerComponent implements OnInit{

  
  displayedColumns: string[] = ['name', 'gmail', 'phone', 'position', 'status', 'id'];
  dataSource = ELEMENT_DATA;
  modalRef?: BsModalRef;

  listAccount: any;

  constructor(
    private modalService: BsModalService,
    private http: HttpClient,
    private toastService: ToastrService,
  ){}

  ngOnInit(): void {
    this.getAccount();
  }

  gmail: string = "";
  password: string = "";
  full_name: string = "";
  address: string = "";
  phone_number: string = "";
  name_clinic: string = "";
  host?: Host;

  createHost(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
  }

  closeLoginForm() {
    this.modalRef?.hide();
  }

  async getAccount() {
    await this.http.get<any>(`${BASE_URL}/account/list-account`).subscribe(
        (res) => {
          this.listAccount = res;
        },
        (err) => {}
    );
  }

  tranformStatus(gmail: any, status: any){
    console.log("status",status);
    if(status === 1){
      const response = this.http.get<any>(`${BASE_URL}/account/ban-account?gmail=${gmail}`).toPromise();
      this.getAccount()
      this.toastService.success('Cấm tài khoản thành công');
    }else{
      const response = this.http.get<any>(`${BASE_URL}/account/active-account?gmail=${gmail}`).toPromise();
      this.getAccount()
      this.toastService.success('Mở tài khoản thành công');
    }
  }

  registerClinic(){
    this.host = new Host(this.gmail, this.password, this.full_name, this.address, this.phone_number, this.name_clinic)
    this.http.post<any>(`${BASE_URL}/account/create-host-account`,this.host).subscribe(
      (res) => {
          this.toastService.success('Đặt lịch thành công');
          this.modalRef?.hide();
      },
      (err) => {}
    );
  }

}