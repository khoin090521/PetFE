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
  selector: 'app-doctor-service',
  templateUrl: './doctor-service.component.html',
  styleUrls: ['./doctor-service.component.scss']
})
export class DoctorServiceComponent implements OnInit{
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

  doctor_id: any = "";
  doctorList: any;

  ngOnInit(): void {
    this.user_role = localStorage.getItem('user_role');
    this.getDoctorByClinic();
  }

  async getListService(doctor_id: any){
    const clinicId = localStorage.getItem("clinic_id");
    await this.http.get<any>(`${BASE_URL}/service-customers/doctor?doctor_id=${doctor_id}`).subscribe(
      (res) => {
        this.listService = res
      },
      (err) => {}
    );
  }
  async getDoctorByClinic(){
    const clinicId = localStorage.getItem("clinic_id");
    await this.http.get<any>(`${BASE_URL}/host/listDoctorByClinic?clinic-id=${clinicId}`).subscribe(
        (res) => {
          this.doctorList = res.data;
        },
        (err) => {}
      );
}
  onSelectDoctor(event: any) {
    const selectedValue = event.target.value;
    this.doctor_id = selectedValue
    this.getListService(selectedValue)
    console.log('selectedValue: ', selectedValue);
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
    if (file) {
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

  openUpdateRecord(template: TemplateRef<any>, service: any){
    this.modalRef = this.modalService.show(template);
    console.log("service",service);
    this.service_id = service.id;
  }

  async updateStatusRecord(){
    const clinicId = localStorage.getItem("clinic_id");
    try {
      await this.http.get<any>(`${BASE_URL}/service-customers/status?id=${Number(this.service_id)}&status=1`).toPromise();
      this.modalRef?.hide();
      this.getListService(this.doctor_id);
      this.toastService.success('Cập nhật trạng thái thành công.');
    } catch (error) {
        this.toastService.error('Cập nhật trạng thái thất bại.');
    } finally {
        
    }
  }
 
  closeDialog(){
    this.modalRef?.hide();
  }

}