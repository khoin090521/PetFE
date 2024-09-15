import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BASE_URL } from '../_common/constants/api';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { async } from '@firebase/util';
import { AngularFireStorage } from '@angular/fire/compat/storage';



interface Food {
  value: string;
  viewValue: string;
}

class Doctor{
  constructor(
    public full_name: string,
    public gmail: string,
    public password: string,
    public address: string,
    public phone_number: string,
    public status: string,
    public role_id: number,
    public clinic_id: number,
    public link_meet: string
  ) {}
} 

class Medicine{
  constructor(
    public id: number,
    public name: string,
    public quantity: number,
    public price: number,
    public type: string,
    public trademark: string,
    public description: string,
    public clinic_id: number,
    public image: string,
  ) {}
} 

class MedicineAdd{
  constructor(
    public name: string,
    public quantity: number,
    public price: number,
    public type: string,
    public trademark: string,
    public description: string,
    public clinic_id: number,
    public image: string,
  ) {}
} 

@Component({
  selector: 'app-create-doctor',
  templateUrl: './create-doctor.component.html',
  styleUrls: ['./create-doctor.component.scss']
})
export class CreateDoctorComponent implements OnInit{

  modalRef?: BsModalRef;
  openMedicineScreen: any = false;
  createDoctorMeeting: any = false;

  full_name: string = "";
  gmail: string = "";
  phone_number: string = "";
  address: string = "";
  password: string = "";
  link_meet: string = "";
  doctor?: Doctor;


  id: number = 0;
  medicine_name: string = "";
  image: string = "";
  quantity: number = 0;
  created_date: string = "";
  price: number = 0;
  type: string = "";
  trade_mark: string = "";
  description: string = "";
  delete_medicine_name: string = "";
  delete_medicine_id: string = "";
  update_medicine: string = "";
  medicine?: Medicine;

  medicineAdd?: MedicineAdd;


  medicine_name_add: string = "";
  image_add: string = "";
  quantity_add: string = "";
  price_add: string = "";
  description_add: string = "";
  type_add: string = "";
  trademark_add: string = "";


  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];

  listMedicine : any;

  constructor(
    private modalService: BsModalService,
    private http: HttpClient,
    private toastService: ToastrService,
    private fireStorage:AngularFireStorage

  ){}

  ngOnInit(): void {
    this.getMedicineByClinicId();
  }

  async getMedicineByClinicId(){
    const clinicId = localStorage.getItem("clinic_id");
    await this.http.get<any>(`${BASE_URL}/medicine/list?clinic-id=${clinicId}`).subscribe(
      (res) => {
        this.listMedicine = res.data
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

  openMedicine(template: TemplateRef<any>){
    // this.openMedicineScreen = true;
    this.modalRef = this.modalService.show(template);
  }

  openCreateMeeting(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
  }

  createDoctorAPI(){
    const clinicId = localStorage.getItem("clinic_id");
    this.doctor = new Doctor(this.full_name, this.gmail, this.password, this.address, this.phone_number, "1", 1, Number(clinicId), this.link_meet);
    
    this.http.post<any>(`${BASE_URL}/host/add`, this.doctor, {
        headers: { 'Content-Type': 'application/json' }
    }).subscribe(
      (res) => {
        this.toastService.success('Thêm bác sĩ thành công');
        this.modalRef?.hide();
      },
      (err) => {
          this.toastService.error('Thêm bác sĩ thất bại');
      }
    );
  }

  openDelete(template: TemplateRef<any>, id: any, name: any){
    this.delete_medicine_name = name;
    this.delete_medicine_id = id;
    this.modalRef = this.modalService.show(template);
  }

  openUpdate(template: TemplateRef<any>, medicine: any){
    this.modalRef = this.modalService.show(template);

    console.log("medicine",medicine);

    this.id = medicine.id;
    this.medicine_name = medicine.name;
    this.quantity = medicine.quantity;
    this.price = medicine.price;
    this.description = medicine.descrition;
    this.trade_mark = medicine.trademark;
    this.type = medicine.type;
  }

  


  async deleteAction(){
    const clinicId = localStorage.getItem("clinic_id");
    try {
      await this.http.get<any>(`${BASE_URL}/medicine/delete?medicine-id=${Number(this.delete_medicine_id)}`).toPromise();
      this.modalRef?.hide();
      this.getMedicineByClinicId();
    } catch (error) {
        this.toastService.error('Xoá thuốc thất bại');
    } finally {
        
    }
  }

  loadingStatusFileUpdate: boolean = false;
  async onFileChangeUpdate(event: any) {
    this.loadingStatusFileUpdate = true;
    const file = event.target.files[0];
    if (file) {
      const path = `yt/${file.name}`;
      try {
        const uploadTask = await this.fireStorage.upload(path, file);
        this.image = await uploadTask.ref.getDownloadURL();
      } catch (error) {
        console.error("Error uploading:", error);
      } finally {
        this.loadingStatusFileUpdate = false;
      }
    } else {
      this.loadingStatusFileUpdate = false;
    }
  }

  loadingStatusFile: boolean = false;
  async onFileChangeAdd(event:any){
    this.loadingStatusFile = true;
    const file = event.target.files[0];
    if (file) {
      const path = `yt/${file.name}`;
      try {
        const uploadTask = await this.fireStorage.upload(path, file);
        this.image_add = await uploadTask.ref.getDownloadURL();
      } catch (error) {
        console.error("Error uploading:", error);
      } finally {
        this.loadingStatusFile = false;
      }
    } else {
      this.loadingStatusFile = false;
    }
  }

  // activeBtnAdd(){
  //   this.medicine_name_add, Number(this.quantity_add), Number(this.price_add), this.type_add, this.trademark_add,this.description_add, Number(clinicId), this.image_add
  // }

  async updateAction(){
    if(!this.medicine_name) {
      this.toastService.warning('Tên thuốc không được để trống!');
    } 
    if(this.quantity <= 0) {
      this.toastService.warning('Số lượng thuốc phải lớn hơn 0!');
    } 
    if(this.price <= 500) {
      this.toastService.warning('Giá tiền phải lớn hơn 500!');
    } 
    if(this.medicine_name && this.quantity > 0 && this.price > 500) {
      const clinicId = localStorage.getItem("clinic_id");
      this.medicine = new Medicine(this.id, this.medicine_name, this.quantity, this.price, this.type, this.trade_mark, this.description, Number(clinicId), this.image);
      console.log("this.image",this.image);
      await this.http.post<any>(`${BASE_URL}/medicine/update`, this.medicine).subscribe(
        (res) => {
          this.toastService.success('Sửa thông tin thuốc thành công');
          this.getMedicineByClinicId();
          this.modalRef?.hide();
        },
        (err) => {
            this.toastService.error('Sửa thông tin thuốc thất bại');
        }
      );
    }
  }

  addAction(){
    
    if(!this.medicine_name_add) {
      this.toastService.warning('Tên thuốc không được để trống!');
    } 
    if(Number(this.quantity_add) <= 0) {
      this.toastService.warning('Số lượng thuốc phải lớn hơn 0!');
    } 
    if(Number(this.price_add) <= 500) {
      this.toastService.warning('Giá tiền phải lớn hơn 500!');
    } 
    if(this.medicine_name_add && Number(this.quantity_add) > 0 && Number(this.price_add) > 500) {
      const clinicId = localStorage.getItem("clinic_id");
      this.medicineAdd = new MedicineAdd(this.medicine_name_add, Number(this.quantity_add), Number(this.price_add), this.type_add, this.trademark_add,this.description_add, Number(clinicId), this.image_add);
      this.http.post<any>(`${BASE_URL}/medicine/add`, this.medicineAdd).subscribe(
        (res) => {
          this.toastService.success('Thêm thông tin thuốc thành công');
          this.getMedicineByClinicId();
          this.modalRef?.hide();
          this.medicine_name_add = "";
          this.quantity_add= "";
          this.price_add = "";
          this.type_add = "";
          this.trademark_add = "";
          this.description_add = "";
          this.image_add = "";
        },
        (err) => {
            this.toastService.error('Thêm thông tin thuốc thất bại');
        }
      );
    }
  }

  closeDialog(){
    this.modalRef?.hide();
  }

}
