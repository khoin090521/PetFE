import { Component, OnInit, HostListener, TemplateRef, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../_common/constants/api';
import { HeaderComponent } from '../header/header.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

export interface Diagnostic {
  id: number;
  date: string;
  position: number;
  name: string;
  diagnostic: string;
}

const DISAGNOSTIC_DATA: Diagnostic[] = [
  {id: 1, position: 1, date: '10/07/2024', name: 'Phạm Văn A', diagnostic: 'Viêm hô hấp ngoài'},
  {id: 2, position: 2, date: '03/05/2023', name: 'Phạm Văn B', diagnostic: 'Viêm hô hấp ngoài'},
];

export interface Schedule {
  id: number;
  schedule: string;
  detail: string;
  status: string;
}

const SCHEDULE_DATA: Schedule[] = [
  {id: 1, schedule: '10h', detail: 'Phạm Văn A', status: 'Viêm hô hấp ngoài'},
  {id: 2, schedule: '12h', detail: 'Phạm Văn B', status: 'Viêm hô hấp ngoài'},
];

interface SearchResult {
  id: number;
  gmail: string;
  full_name: string;
  address: string;
  phone_number: string;
  roles: string[];
  status: number;
}

class PetRecord{
  constructor(
    public pet_id: number,
    public doctor_id: number,
    public examination_date: string,
    public symptom_description: string,
    public symptoms_time: string,
    public body_temperature: number,
    public external_examinationd: string,
    public test_results: string,
    public preliminary_diagnosis: string,
    public medications: string,
    public nutrition: string,
    public re_examination: string,
  ) {}
}

@Component({
  selector: 'app-chat-doctor',
  templateUrl: './chat-doctor.component.html',
  styleUrls: ['./chat-doctor.component.scss']
})
export class ChatDoctorComponent implements OnInit{

  constructor(
    private http: HttpClient,
    private headerComponent: HeaderComponent,
    private modalService: BsModalService,
    private toastService: ToastrService,
  ){
  }

  modalRef?: BsModalRef;
  openContactScreen: any = true;
  selectPetState: any = false;
  openContactScreenPet: any = true;
  openAddRecord: any = false;
  openSchedule: any = false;
  closeRecord: any = true;
  displayedDiagnostic: string[] = ['position', 'date', 'name', 'diagnostic','id'];
  dataSource = DISAGNOSTIC_DATA;

  initRecordDoctor: any = true;

  displayedSchedule: string[] = ['schedule', 'detail', 'status', 'id'];
  dataSourceSchedule = SCHEDULE_DATA;

  profileBtn: string = "profile-btn";
  erecordBtn: string = "erecord-btn";
  searchResults?: SearchResult[] | null;
  bookingSchedule: any;

  transistionStatus: number = 1;
  listPetByUserId: any;
  idVerify: any;
  textOTP: any;
  listPetRecordOTP: boolean = false;
  getPetRecord: any;
  userName: any;
  userGmail: any;
  userAddress: any;
  userPhone: any;

  petName: any;
  petAge: any;

  petRecord?: PetRecord;


  pet_id: number = 0;
  doctor_id: number = 0;
  examination_date: string = "";
  symptom_description: string = "";
  symptoms_time: string = "";
  body_temperature: string = "";
  external_examinationd: string = "";
  test_results: string = "";
  preliminary_diagnosis: string = "";
  medications: string = "";
  nutrition: string = "";
  re_examination: string = "";

  petNameDetail: string = "";
  petAgeDetail: string = "";
  symptom_descriptionDetail: string = "";
  symptoms_timeDetail: string = "";
  body_temperatureDetail: string = "";
  test_resultsDetail: string = "";
  external_examinationdDetail: string = "";
  medicationsDetail: string = "";
  nutritionDetail: string = "";
  re_examinationDetail: string = "";

  ngOnInit(): void {
    this.getScheduleByDoctorId();
    setTimeout(() => {
      this.listPetRecord();
    }, 1000)
  }

  async onSearch(searchKey: any) {
    const response = await this.http.get<SearchResult[]>(`${BASE_URL}/search/customer?search=${searchKey}`).toPromise();
    this.searchResults = response;
    this.openSchedule = true;
    this.closeRecord = false;

    this.initRecordDoctor = false;

    // this.openSchedule = false;
    // this.closeRecord = true;
  }

  viewDetailPet(petRecord: any, template: TemplateRef<any>){

    this.symptom_descriptionDetail = petRecord.symptom_description;
    this.symptoms_timeDetail = petRecord.symptoms_time;
    this.body_temperatureDetail = petRecord.body_temperature;
    this.test_resultsDetail = petRecord.test_results;
    this.external_examinationdDetail = petRecord.external_examination;
    this.re_examinationDetail = petRecord.re_examination;
    this.nutritionDetail = petRecord.nutrition;
    this.medicationsDetail = petRecord.medications;

    this.modalRef = this.modalService.show(template);
  }

  petRecordByDoctorId: any;
  async listPetRecord() {
    const doctor_id = Number(localStorage.getItem('user_id'));
    const response = await this.http.get<any>(`${BASE_URL}/petRecord/listByDoctorId?doctor-id=${doctor_id}`).toPromise();
    this.petRecordByDoctorId = response.data;
    console.log("this.searchResults",this.searchResults);
  }

  async verifyBooking(id: any){
    const response = await this.http.get<any>(`${BASE_URL}/booking/update?booking-id=${id}&status=1`).toPromise();
    if(response.status === 1){
      this.toastService.success('Đã chấp nhận lịch hẹn');
    }else{
      this.toastService.success('Đã có lỗi xảy ra');
    }
    this.searchResults = response;
    console.log("searchResults",this.searchResults);
    this.getScheduleByDoctorId(); 
  }

  async rejectBooking(id: any){
    const response = await this.http.get<any>(`${BASE_URL}/booking/update?booking-id=${id}&status=-1`).toPromise();
    if(response.status === 1){
      this.toastService.success('Đã từ chối lịch hẹn');
    }else{
      this.toastService.success('Đã có lỗi xảy ra');
    }
    this.searchResults = response;
    console.log("searchResults",this.searchResults);
    this.getScheduleByDoctorId(); 
  }

  async getScheduleByDoctorId() {
    const doctor_id = Number(localStorage.getItem('user_id'));
    const response = await this.http.get<any>(`${BASE_URL}/booking/list?doctor-id=${doctor_id}`).toPromise();
    this.bookingSchedule = response.data;
    console.log("bookingSchedule",this.bookingSchedule);
  }

  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement; // Type assertion
    if (inputElement && inputElement.classList.contains('search-input')) {
      const searchKey = inputElement.value;
      this.openAddRecord = true;
      this.listPetRecordOTP = false;
      this.onSearch(searchKey);
    }
  } 

  add_record(){
    this.openAddRecord = true;
    this.openContactScreen = false;
    this.openSchedule = false;
  }

  open_schedule(){
    this.openSchedule = true;
    this.closeRecord = true;
    this.initRecordDoctor = 1;
    this.listPetRecordOTP = false;

    if(this.transistionStatus == 0){
      this.erecordBtn = "erecord-btn";
      this.profileBtn = "profile-btn";
    }else if(this.transistionStatus == 1){
      this.erecordBtn = "profile-btn";
      this.profileBtn = "erecord-btn";
    }
    this.eRecordScreen = true;
  }

  openProfile(){
    this.initRecordDoctor = true;
    this.closeRecord = false;

    if(this.transistionStatus == 1){
      this.profileBtn = "profile-btn";
      this.erecordBtn = "erecord-btn";
    }else if(this.transistionStatus == 0){
      this.erecordBtn = "profile-btn";
      this.profileBtn = "erecord-btn";
    }
  }

  eRecordScreen: boolean = false;
  openERecord(){
    if(this.transistionStatus == 0){
      this.erecordBtn = "erecord-btn";
      this.profileBtn = "profile-btn";
    }else if(this.transistionStatus == 1){
      this.erecordBtn = "profile-btn";
      this.profileBtn = "erecord-btn";
    }
    this.eRecordScreen = true;
  }

  async selectPetByUserId(user: any, template: TemplateRef<any>){
    this.idVerify = user.id;
    this.userName = user.full_name;
    this.userAddress = user.address;
    this.userPhone = user.phone_number;
    this.userGmail = user.gmail;
    const response = await this.http.get<any>(`${BASE_URL}/pet/list?index-page=1&size=10&customer-id=${user.customer_id}`).toPromise();
    this.listPetByUserId = response.data.content;
    console.log("this.listPetByUserId",this.listPetByUserId);
    this.selectPetState = true;
    this.modalRef = this.modalService.show(template);
  }

  async sendOTP(pet: any){

    this.pet_id = pet.id;
    this.petAge = pet.age;
    this.petName = pet.name;

    this.selectPetState = false;
    const response = await this.http.get<any>(`${BASE_URL}/email/sendCode?user-id=`+this.idVerify).toPromise();    
    if(response.status === 1){
        this.toastService.success('Đã gửi mã đến gmail');
    }else{
      this.toastService.success('Không gửi được mã đến gmail');
    }
  }

  async verifyOTP(){
    if(this.textOTP){
      const response = await this.http.get<any>(`${BASE_URL}/email/checkCode?code=${this.textOTP}&user-id=${this.idVerify}`).toPromise();    
      console.log("response",JSON.stringify(response));
      if(response.data === "True"){
          this.textOTP = "";
          this.toastService.success('Xác thực thành công');
          this.listPetRecordOTP = true;
          this.initRecordDoctor = 1;
          this.modalRef?.hide();
      }else{
        this.toastService.warning('Xác thực thất bại');
      }
      const responseRecord = await this.http.get<any>(`${BASE_URL}/petRecord/list?pet-id=${this.pet_id}`).toPromise();
      this.getPetRecord = responseRecord.data;
    }
  }

  viewDetailPetRecord(petRecord: any, template: TemplateRef<any>){
    this.symptom_descriptionDetail = petRecord.symptom_description;
    this.symptoms_timeDetail = petRecord.symptoms_time;
    this.body_temperatureDetail = petRecord.body_temperature;
    this.test_resultsDetail = petRecord.test_results;
    this.external_examinationdDetail = petRecord.external_examination;
    this.re_examinationDetail = petRecord.re_examination;
    this.nutritionDetail = petRecord.nutrition;
    this.medicationsDetail = petRecord.medications;

    this.modalRef = this.modalService.show(template);
  }

  openAddPetRecordForm(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
  }

  async createPetRecord(){

    this.doctor_id = Number(localStorage.getItem('user_id'));
    const currentDate = new Date();
    this.examination_date = currentDate.getFullYear() + '-' +
    ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' +
    ('0' + currentDate.getDate()).slice(-2);

    this.petRecord = new PetRecord(
      this.pet_id, this.doctor_id, this.examination_date, this.symptom_description, 
      this.symptoms_time, Number(this.body_temperature), this.external_examinationd,
      this.test_results, this.preliminary_diagnosis, this.medications,this.nutrition, this.re_examination);
      await this.http.post<any>(`${BASE_URL}/petRecord/add`, this.petRecord).subscribe(
      (res) => {
        this.toastService.success('Thêm bệnh án thành công');
        this.modalRef?.hide();
        this.examination_date = ""; 
        this.symptom_description = ""; 
        this.symptoms_time = ""; 
        this.body_temperature = "";
        this.external_examinationd = "";
        this.test_results = "";
        this.preliminary_diagnosis = "";
        this.medications = "";
        this.nutrition = ""; 
        this.re_examination = "";
        this.getPetRecordAfterAdd();
      },
      (err) => {
        this.toastService.success('Thêm bệnh án thất bại');
        this.modalRef?.hide();
      }
    );
    
  }

  async getPetRecordAfterAdd(){
    const response = await this.http.get<any>(`${BASE_URL}/petRecord/list?pet-id=${this.pet_id}`).toPromise();
    this.getPetRecord = response.data;
  }

  closeDialog(){
    this.modalRef?.hide();
  }
}