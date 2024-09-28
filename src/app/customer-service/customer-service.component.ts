import { Component, OnInit, HostListener, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../_common/constants/api';
import { HeaderComponent } from '../header/header.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { async } from '@firebase/util';
import { AngularFireStorage } from '@angular/fire/compat/storage';

class Service{
  constructor(
    public serviceName: string,
    public servicePrice: number,
  ) {}
} 

@Component({
  selector: 'app-customer-service',
  templateUrl: './customer-service.component.html',
  styleUrls: ['./customer-service.component.scss']
})
export class CustomerServiceComponent implements OnInit{
  constructor(
    private modalService: BsModalService,
    private http: HttpClient,
    private toastService: ToastrService,
    private fireStorage: AngularFireStorage,
    private headerComponent: HeaderComponent,

  ){}

  modalRef?: BsModalRef;
  openMedicineScreen: any = false;
  createDoctorMeeting: any = false;
  user_role: any = "";
  routerLink: any;
  is_user: boolean = false;
  is_doctor: boolean = false;

  recordId: string = "";
  serviceName: string = "";
  service_id: number = 0;
  servicePrice: number = 0;
  image: string = "";
  comment: string = "";
  status: number = 0;
  service?: Service;
  delete_serviceName: string = "";
  delete_service_id: string = "";
  listService : any;
  listServiceCombobox: any = [];

  ngOnInit(): void {
    this.user_role = localStorage.getItem('user_role');

    if(this.user_role === "customer") {
      this.routerLink = "/home-customer";
      this.is_user = true;
    }else if(this.user_role === "doctor") {
      this.routerLink = "/chat-doctor/:userId";
      this.is_doctor = true;
    }
    const routerUrl = window.location.href
    const urlObj = new URL(routerUrl);
    const recordId = urlObj.searchParams.get('recordId') || '';
    this.recordId = urlObj.pathname.replace("/customer-service/", "").replace("/my-service/", "")
    this.getListService();
    if(this.user_role === "doctor") {
      this.getListServiceCombobox();
    }
  }

  async getListService(){
    const clinicId = localStorage.getItem("clinic_id");
    await this.http.get<any>(`${BASE_URL}/service-customers/pet-record?pet_record_id=${this.recordId}`).subscribe(
      (res) => {
        this.listService = res
      },
      (err) => {}
    );
  }
  async getListServiceCombobox(){
    const clinicId = localStorage.getItem("clinic_id");
    await this.http.get<any>(`${BASE_URL}/services/clinic?clinic_id=${clinicId}`).subscribe(
      (res) => {
        this.listServiceCombobox = res
      },
      (err) => {}
    );
  }

  onSelectService(event: any) {
    const selectedValue = event.target.value;
    this.servicePrice = this.listServiceCombobox.find((i: any) => i.serviceName == selectedValue).servicePrice;
  }

  formatPrice(price: string | number ): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  openCreateDoctor(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeLoginForm() {
    this.modalRef?.hide();
  }

  loadingStatusFile: boolean = false;
  async onFileChangeAdd(event:any){
    this.loadingStatusFile = true;
    const file = event.target.files[0];
    if(!file.type.includes("image")) {
      this.toastService.warning("Chỉ có thể chọn ảnh");
      this.image = ""
    }
    if (file.type.includes("image")) {
      const path = `yt/${file.name}`;
      try {
        const uploadTask = await this.fireStorage.upload(path, file);
        this.image = await uploadTask.ref.getDownloadURL();
        console.log('this.image: ', this.image);
      } catch (error) {
        console.error("Error uploading:", error);
      } finally {
        this.loadingStatusFile = false;
      }
    } else {
      this.loadingStatusFile = false;
    }
  }

  openImage() {
      console.log("click");
      window.open(this.image, '_blank');
  }

  openAdd(template: TemplateRef<any>){
    // this.openMedicineScreen = true;
    this.modalRef = this.modalService.show(template);
    this.serviceName = "";
    this.servicePrice = 0;
  }

  addAction(){
    if(!this.serviceName) {
      this.toastService.warning('Vui lòng chọn dịch vụ!');
    } else {
      const clinicId = localStorage.getItem("clinic_id");
      const doctor_id = localStorage.getItem("user_id");
      this.service = new Service(this.serviceName, this.servicePrice);
      
      this.http.post<any>(`${BASE_URL}/service-customers/create`, {
        ...this.service,
        record_id: this.recordId,
        doctor_id: doctor_id
      }, {
          headers: { 'Content-Type': 'application/json' }
      }).subscribe(
        (res) => {
          this.toastService.success('Thêm dịch vụ phía khách hàng thành công!');
          this.modalRef?.hide();
          this.getListService()
        },
        (err) => {
            this.toastService.error('Thêm dịch vụ thất bại!');
        }
      );
    }
  }


  openDelete(template: TemplateRef<any>, id: any, serviceName: any){
    this.delete_serviceName = serviceName;
    this.delete_service_id = id;
    this.modalRef = this.modalService.show(template);
  }

  openAddRecord(template: TemplateRef<any>, service: any){
    this.modalRef = this.modalService.show(template);
    console.log("service",service);
    this.service_id = service.id;
    this.comment = '';
  }
  openViewRecord(template: TemplateRef<any>, service: any){
    this.modalRef = this.modalService.show(template);
    console.log("service",service);
    this.comment = service.comment;
    this.image = service.result;
  }

  async deleteAction(){
    const clinicId = localStorage.getItem("clinic_id");
    try {
      await this.http.get<any>(`${BASE_URL}/medicine/delete?medicine-id=${Number(this.delete_service_id)}`).toPromise();
      this.modalRef?.hide();
      this.getListService();
      this.toastService.success('Xoá dịch vụ thành công.');
    } catch (error) {
        this.toastService.error('Xoá dịch vụ thất bại.');
    } finally {
        
    }
  }
  async updateAction(){
    if(!this.comment) {
      this.toastService.warning('Nhận xét không được để trống!');
    } 
    if(!this.image) {
      this.toastService.warning('Tải ảnh kết quả!');
    } 
    if(this.comment && this.image) {
      const clinicId = localStorage.getItem("clinic_id");
      await this.http.post<any>(`${BASE_URL}/service-customers/details`, {
        id: this.service_id,
        result: this.image,
        comment: this.comment,
      }).subscribe(
        (res) => {
          this.toastService.success('Cập nhật kết quả thành công!');
          this.getListService();
          this.modalRef?.hide();
        },
        (err) => {
            this.toastService.error('Cập nhật kết quả thất bại');
        }
      );
    }
  }

  closeDialog(){
    this.modalRef?.hide();
  }

}