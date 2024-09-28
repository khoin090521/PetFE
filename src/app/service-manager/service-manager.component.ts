
import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BASE_URL } from '../_common/constants/api';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
  selector: 'app-service-manager',
  templateUrl: './service-manager.component.html',
  styleUrls: ['./service-manager.component.scss']
})
export class ServiceManagerComponent implements OnInit{

  modalRef?: BsModalRef;
  openMedicineScreen: any = false;
  createDoctorMeeting: any = false;

  routerLink: string = "/create-doctor";

  serviceName: string = "";
  service_id: any;
  servicePrice: number = 0;
  service?: Service;
  delete_serviceName: string = "";
  delete_service_id: string = "";
  listService : any;

  constructor(
    private modalService: BsModalService,
    private http: HttpClient,
    private toastService: ToastrService,
    private fireStorage:AngularFireStorage

  ){}

  ngOnInit(): void {
    this.getListService();
  }

  async getListService(){
    const clinicId = localStorage.getItem("clinic_id");
    await this.http.get<any>(`${BASE_URL}/services/clinic?clinic_id=${clinicId}`).subscribe(
      (res) => {
        console.log('res: ', res);
        this.listService = res
      },
      (err) => {}
    );
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

  openAdd(template: TemplateRef<any>){
    // this.openMedicineScreen = true;
    this.modalRef = this.modalService.show(template);
    this.serviceName = "";
    this.servicePrice = 0;
  }

  addAction(){
    if(!this.serviceName) {
      this.toastService.warning('Tên dịch vụ không được để trống!');
    } 
    console.log('this.servicePrice: ', this.servicePrice);
    if(this.servicePrice <= 0) {
      this.toastService.warning('Giá tiền phải lớn hơn 0!');
    } 
    if(this.serviceName && this.servicePrice > 0) {
      const clinicId = localStorage.getItem("clinic_id");
      this.service = new Service(this.serviceName, this.servicePrice);
      
      this.http.post<any>(`${BASE_URL}/services/clinic`, {
        ...this.service,
        clinic_id: clinicId
      }, {
          headers: { 'Content-Type': 'application/json' }
      }).subscribe(
        (res) => {
          this.toastService.success('Thêm dịch vụ thành công');
          this.modalRef?.hide();
          this.getListService();
        },
        (err) => {
            this.toastService.error('Thêm dịch vụ thất bại');
        }
      );
    }
  }


  openDelete(template: TemplateRef<any>, id: any, serviceName: any){
    this.delete_serviceName = serviceName;
    this.delete_service_id = id;
    this.modalRef = this.modalService.show(template);
  }

  openUpdate(template: TemplateRef<any>, service: any){
    this.modalRef = this.modalService.show(template);
    this.service_id = service.id;
    this.serviceName = service.serviceName;
    this.servicePrice = service.servicePrice;
  }

  async deleteAction(){
    const clinicId = localStorage.getItem("clinic_id");
    try {
      await this.http.get<any>(`${BASE_URL}/services/delete?id=${Number(this.delete_service_id)}`).toPromise();
      this.modalRef?.hide();
      this.getListService();
      this.toastService.success('Xoá dịch vụ thành công.');
    } catch (error) {
        this.toastService.error('Xoá dịch vụ thất bại.');
    } finally {
        
    }
  }
  async updateAction(){
    if(!this.serviceName) {
      this.toastService.warning('Tên dịch vụ không được để trống!');
    } 
    console.log('this.servicePrice: ', this.servicePrice);
    if(this.servicePrice <= 0) {
      this.toastService.warning('Giá tiền phải lớn hơn 0!');
    } 
    if(this.serviceName && this.servicePrice > 0) {
      const clinicId = localStorage.getItem("clinic_id");
      this.service = new Service(this.serviceName, this.servicePrice);
      await this.http.post<any>(`${BASE_URL}/services`, {
        ...this.service,
        id: this.service_id
      }).subscribe(
        (res) => {
          this.toastService.success('Sửa thông tin dịch vụ thành công');
          this.getListService();
          this.modalRef?.hide();
        },
        (err) => {
            this.toastService.error('Sửa thông tin dịch vụ thất bại');
        }
      );
    }
  }

  closeDialog(){
    this.modalRef?.hide();
  }

  // loadingStatusFileUpdate: boolean = false;
  // async onFileChangeUpdate(event: any) {
  //   this.loadingStatusFileUpdate = true;
  //   const file = event.target.files[0];
  //   if (file) {
  //     const path = `yt/${file.name}`;
  //     try {
  //       const uploadTask = await this.fireStorage.upload(path, file);
  //       this.image = await uploadTask.ref.getDownloadURL();
  //     } catch (error) {
  //       console.error("Error uploading:", error);
  //     } finally {
  //       this.loadingStatusFileUpdate = false;
  //     }
  //   } else {
  //     this.loadingStatusFileUpdate = false;
  //   }
  // }
  // loadingStatusFile: boolean = false;
  // async onFileChangeAdd(event:any){
  //   this.loadingStatusFile = true;
  //   const file = event.target.files[0];
  //   if (file) {
  //     const path = `yt/${file.name}`;
  //     try {
  //       const uploadTask = await this.fireStorage.upload(path, file);
  //       this.image_add = await uploadTask.ref.getDownloadURL();
  //     } catch (error) {
  //       console.error("Error uploading:", error);
  //     } finally {
  //       this.loadingStatusFile = false;
  //     }
  //   } else {
  //     this.loadingStatusFile = false;
  //   }
  // }

}
