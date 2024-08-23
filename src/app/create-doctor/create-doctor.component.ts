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
  description: string = "";
  delete_medicine_name: string = "";
  delete_medicine_id: string = "";
  update_medicine: string = "";
  medicine?: Medicine;

  medicineAdd?: MedicineAdd;


  medicine_name_add: string = "";
  image_add: string = "";
  quantity_add: number = 0;
  price_add: number = 0;
  description_add: string = "";


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

    this.id = medicine.id;
    this.medicine_name = medicine.name;
    this.quantity = medicine.quantity;
    this.price = medicine.price;
    this.description = medicine.description;
  }


  deleteAction(){
    const clinicId = localStorage.getItem("clinic_id");
    try {
        const response = this.http.delete<any>(`${BASE_URL}/medicine/delete?medicine-id=`+Number(this.delete_medicine_id)).toPromise();

        // if (response.state === true) {
        //     this.toastService.success('Xoá thuốc thành công');
        // } else {
        //     this.toastService.error('Xoá thuốc thất bại');
        // }
    } catch (error) {
        this.toastService.error('Xoá thuốc thất bại');
    } finally {
        this.modalRef?.hide();
        this.getMedicineByClinicId();
    }
  }


  async onFileChangeUpdate(event:any){
    const file = event.target.files[0]
    if(file){
      const path = `yt/${file.name}`
      const uploadTask =await this.fireStorage.upload(path,file)
      this.image = await uploadTask.ref.getDownloadURL();
    }
  }

  async onFileChangeAdd(event:any){
    const file = event.target.files[0]
    if(file){
      const path = `yt/${file.name}`
      const uploadTask =await this.fireStorage.upload(path,file)
      this.image_add = await uploadTask.ref.getDownloadURL();
    }
  }

  updateAction(){
    const clinicId = localStorage.getItem("clinic_id");
    this.medicine = new Medicine(this.id, this.medicine_name, this.quantity, this.price, "class 1", "identifying", this.description, Number(clinicId), this.image);
    this.http.put<any>(`${BASE_URL}/medicine/update`, this.medicine).subscribe(
      (res) => {
        this.toastService.success('Sửa thông tin thuốc thành công');
        this.modalRef?.hide();
      },
      (err) => {
          this.toastService.error('Sửa thông tin thuốc thất bại');
      }
    );
  }

  addAction(){
    const clinicId = localStorage.getItem("clinic_id");
    this.medicineAdd = new MedicineAdd(this.medicine_name_add, this.quantity_add, this.price_add, "class 1", "identifying",this.description_add, Number(clinicId), this.image_add);
    this.http.post<any>(`${BASE_URL}/medicine/add`, this.medicineAdd).subscribe(
      (res) => {
        this.toastService.success('Thêm thông tin thuốc thành công');
        this.getMedicineByClinicId();
        this.modalRef?.hide();
      },
      (err) => {
          this.toastService.error('Thêm thông tin thuốc thất bại');
      }
    );
  }

}
