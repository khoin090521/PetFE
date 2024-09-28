import { Component, OnInit, TemplateRef, HostListener } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { BASE_URL } from '../_common/constants/api';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

export interface PeriodicElement {
  doctor: string;
  date: any;
  diagnose: string;
  detail: string;
}

class HealthHistory{
  constructor(
    public pet_id: number,
    public description: string,
  ) {}
}

class VaccineHistory{
  constructor(
    public pet_id: number,
    public description: string,
    public vaccin_image: string,
    public name: string,
    public injection_date: string,
  ) {}
}

class Pet{
  constructor(
    public id: number,
    public name: string,
    public age: string,
    public gender: boolean,
    public species: string,
    public identifying: string,
    public originCertificate: string,
    public transfer_contract: string,
    public origin_certificate: string,
    public health_history_requests: any,
    public vacination_history_requests: any,
    public customer_pet_requestes: any,

  ) {}
}


const ELEMENT_DATA: PeriodicElement[] = [
  {date: '07-02-2024', doctor: 'Hydrogen', diagnose: "Nấm ở vùng lưng", detail: 'H'},
  {date: '07-02-2024', doctor: 'Helium', diagnose:  "Nấm ở vùng lưng", detail: 'He'},
  {date: '07-02-2024', doctor: 'Lithium', diagnose:  "Nấm ở vùng lưng", detail: 'Li'},
  {date: '07-02-2024', doctor: 'Beryllium', diagnose:  "Nấm ở vùng lưng", detail: 'Be'},
  {date: '07-02-2024', doctor: 'Boron', diagnose:  "Nấm ở vùng lưng", detail: 'B'},
  {date: '07-02-2024', doctor: 'Carbon', diagnose:  "Nấm ở vùng lưng", detail: 'C'},
  {date: '07-02-2024', doctor: 'Nitrogen', diagnose:  "Nấm ở vùng lưng", detail: 'N'},
  {date: '07-02-2024', doctor: 'Oxygen', diagnose:  "Nấm ở vùng lưng", detail: 'O'},
  {date: '07-02-2024', doctor: 'Fluorine', diagnose:  "Nấm ở vùng lưng", detail: 'F'},
  {date: '07-02-2024', doctor: 'Neon', diagnose:  "Nấm ở vùng lưng", detail: 'Ne'},
];

@Component({
  selector: 'app-detail-pet',
  templateUrl: './detail-pet.component.html',
  styleUrls: ['./detail-pet.component.scss'],
})
export class DetailPetComponent implements OnInit{
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource123: any = ELEMENT_DATA;

  statusTab: boolean = true;
  profiltTabStatus: number = 1;

  profileBtn: string = "profile-btn";
  erecordBtn: string = "erecord-btn";

  transistionStatus: number = 1;

  petId: number = 0;
  petName: string = "";
  petAge: string = "";
  petGender: string = "";
  petSpecies: string = "";
  petIdentifying: string = "";
  imagePet: string = "";
  certificatePet: string = "";
  healthPetList: any;
  recordPetList: any;
  descriptionHealth: any;
  healthHistory?: HealthHistory;
  modalRef?: BsModalRef;


  medications: any;
  nutrition: any;
  examination_date: any;
  symptom_description: any;
  symptoms_time: any;
  body_temperature: any;
  test_results: any;
  re_examination: any;

  vaccine: any;
  descriptionVacineHistory: any;
  injection_date: any;
  urlVaccineImage: any;

  listVacinationHistory: any;
  vaccineHistory?: VaccineHistory;

  pet?: Pet;

  routerLink: any = "/service-manager";
  petRecordId: string = "";

  async ngAfterViewInit() {
    const routerUrl = window.location.href
    console.log("routerUrl",routerUrl);
    const urlObj = new URL(routerUrl);

    this.petId = Number(urlObj.searchParams.get('petId') || '');
    // const name = urlObj.searchParams.get('name') || '';
    // const age = urlObj.searchParams.get('age') || ''; 
    // const gender = urlObj.searchParams.get('gender') || '';
    // const species = urlObj.searchParams.get('species') || '';
    // const identifying = urlObj.searchParams.get('identifying') || '';
    // const image = urlObj.searchParams.get('image') || '';
    // const certificate = urlObj.searchParams.get('origin_certificate') || '';
    // console.log("this.petId",this.petId);
    // console.log("certificate",certificate);

    // setTimeout(() => {
    //     this.petName = decodeURIComponent(name);
    //     this.petAge = decodeURIComponent(age);
    //     this.petGender = decodeURIComponent(gender);
    //     this.petSpecies = decodeURIComponent(species);
    //     this.petIdentifying = decodeURIComponent(identifying);
    //     this.imagePet = image;
    //     this.certificatePet = certificate;
    //   }, 500)
  }

  constructor(
    private http: HttpClient,
    private modalService: BsModalService,
    private fireStorage:AngularFireStorage,
    private toastService: ToastrService,
    private router: Router,
  ){
  }

  ngOnInit(): void {    

    this.healthHistoryst = "noHighlightBtn";
    this.injectionHistory = "noHighlightBtn";
    this.basicDetail = "highlightBtn";
    const routerUrl = window.location.href
    console.log("routerUrl",routerUrl);
    const urlObj = new URL(routerUrl);
    this.petId = Number(urlObj.searchParams.get('petId') || '');
    console.log("this.petId",this.petId)
    this.getDetailPet()
    setTimeout(() => {
      this.getVacinationHistory();
      this.getHeathPet();
      this.getRecordPet();
    }, 1000)
  }

  getDetailPet() {
    const user_id = Number(localStorage.getItem('user_id'));
    this.http.get<any>(`${BASE_URL}/pet/show-detail?pet-id=${this.petId}&customer-id=${user_id}`).subscribe(
      (res) => {
        console.log("res",res)
          this.petName = res.data.name;
          this.petAge = res.data.age;
          this.petGender = res.data.gender;
          this.petSpecies = res.data.species;
          this.petIdentifying = res.data.identifying;
          this.imagePet = res.data.transfer_contract;
          this.certificatePet = res.data.origin_certificate;
      },
      (err) => {
        this.toastService.error("Không tìm thấy thông tin pet.")
      } 
    );
  }

  updatePet(){
    const user_id = Number(localStorage.getItem('user_id'));
    this.pet = new Pet(Number(this.petId), this.petName, this.petAge, true, this.petSpecies, this.petIdentifying, this.certificatePet, this.imagePet, this.certificatePet, null, null, null);
    this.http.post<any>(`${BASE_URL}/pet/update`,{
      ...this.pet,
      customer_id: user_id,
      status: 0
    }).subscribe(
      (res) => {
        this.listVacinationHistory = res.data;
        this.toastService.success("Back lại trang trước và cập nhật lại trang này");
      },
      (err) => {
        this.toastService.error("Cập nhật thất bại")
      } 
    );
  }

  urlPetImage: any = "";
  loadingStatusAvatar: boolean = false;
  async onFileChange(event:any){
    this.loadingStatusAvatar = true;

    const file = event.target.files[0];
    if (file) {
      const path = `yt/${file.name}`;
      try {
        const uploadTask = await this.fireStorage.upload(path, file);
        this.imagePet = await uploadTask.ref.getDownloadURL();
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        this.loadingStatusAvatar = false;
      }
    } else {
      this.loadingStatusAvatar = false;
    }
  }


  async onSearch(searchKey: any) {
    this.petId;
    const user_id = Number(localStorage.getItem('user_id'));
    const response = await this.http.get<any>(`${BASE_URL}/vacinationHistory/search?pet-id=${this.petId}&vacciname=${searchKey}&customer-id=${user_id}`).toPromise();
    this.listVacinationHistory = response.data;
    console.log("searchResults",JSON.stringify(response.data));
  }

  searchKeyWord: any;
  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement && inputElement.classList.contains('sub-search-input')) {
      const searchKey = inputElement.value;
      this.searchKeyWord = searchKey;
      console.log("searchKey",searchKey);
      console.log("this.petId;",this.petId);
      this.onSearch(searchKey);
    }
  }


  deleteHealth(healthPet: any){
    const user_id = Number(localStorage.getItem('user_id'));
    this.http.get<any>(`${BASE_URL}/healthHistory/delete?healthhistory-id=${healthPet.id}&customer-id=${user_id}`).subscribe(
      (res) => {
        this.getHeathPet();
        this.toastService.success("Xoá lịch sử sức khoẻ thành công");
      },
      (err) => {
        this.toastService.success("Xoá lịch sử sức khoẻ thất bại");
      } 
    );
  }

  deleteInjection(injectionPet: any){
    const user_id = Number(localStorage.getItem('user_id'));
    this.http.get<any>(`${BASE_URL}/vacinationHistory/delete?vacinationhistory-id=${injectionPet.id}&customer-id=${user_id}`).subscribe(
      (res) => {
        this.getVacinationHistory();
        this.toastService.success("Xoá lịch sử tiêm phòng thành công");
      },
      (err) => {
        this.toastService.success("Xoá lịch sử tiêm phòng thành công");
      } 
    );
  }

  urlCertificate: any = "";
  async onFileChangeCertificate(event:any){
    this.loadingStatusAvatar = true;

    const file = event.target.files[0];
    if (file) {
      const path = `yt/${file.name}`;
      try {
        const uploadTask = await this.fireStorage.upload(path, file);
        this.certificatePet = await uploadTask.ref.getDownloadURL();
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        this.loadingStatusAvatar = false;
      }
    } else {
      this.loadingStatusAvatar = false;
    }
  }



  getVacinationHistory(){
    const user_id = Number(localStorage.getItem('user_id'));
    this.http.get<any>(`${BASE_URL}/vacinationHistory/list?pet-id=${this.petId}&customer-id=${user_id}`).subscribe(
      (res) => {
        this.listVacinationHistory = res.data;
      },
      (err) => {} 
    );
  }

  getHeathPet(){
    const user_id = Number(localStorage.getItem('user_id'));
    this.http.get<any>(`${BASE_URL}/healthHistory/list?pet-id=${this.petId}&customer-id=${user_id}`).subscribe(
      (res) => {
        this.healthPetList = res.data;
      },
      (err) => {}
    );
  }

  getRecordPet(){
    this.http.get<any>(`${BASE_URL}/petRecord/list?pet-id=${this.petId}`).subscribe(
      (res) => {
        this.recordPetList = res.data;
      },
      (err) => {}
    );
  }

  addHealthHistory(){
    const user_id = Number(localStorage.getItem('user_id'));
    this.healthHistory = new HealthHistory(this.petId, this.descriptionHealth);
    console.log("123",this.healthHistory);
    this.http.post<any>(`${BASE_URL}/healthHistory/add`,{
      ...this.healthHistory, 
      customer_id: user_id
    }).subscribe(
      (res) => {
        console.log("res",JSON.stringify(res));
        this.getHeathPet();
        this.descriptionHealth = "";
      },
      (err) => {
        
      }
    );
  }

  openProfile(){
    this.profiltTabStatus = 1;
    this.statusTab = true;
    if(this.transistionStatus == 1){
      this.profileBtn = "profile-btn";
      this.erecordBtn = "erecord-btn";
    }else if(this.transistionStatus == 0){
      this.erecordBtn = "profile-btn";
      this.profileBtn = "erecord-btn";
    }
  }

  openERecord(){

    this.healthHistoryst = "noHighlightBtn";
    this.injectionHistory = "noHighlightBtn";
    this.basicDetail = "highlightBtn";

    this.profiltTabStatus = 0;
    this.statusTab = false;
    if(this.transistionStatus == 0){
      this.erecordBtn = "erecord-btn";
      this.profileBtn = "profile-btn";
    }else if(this.transistionStatus == 1){
      this.erecordBtn = "profile-btn";
      this.profileBtn = "erecord-btn";
    }
  }

  // stateSwitch: number = 0;

  basicDetail: any;
  healthHistoryst: any;
  injectionHistory: any;
  meeting: any;
 
  openBasicDetail(){
    this.profiltTabStatus = 1;
    this.healthHistoryst = "noHighlightBtn";
    this.injectionHistory = "noHighlightBtn";
    this.basicDetail = "highlightBtn";
  }

  openHealthHistory(){
    this.profiltTabStatus = 2;
    this.basicDetail = "noHighlightBtn";
    this.injectionHistory = "noHighlightBtn";
    this.healthHistoryst = "highlightBtn";
  }

  openInjectionhHistory(){
    this.profiltTabStatus = 3;
    this.healthHistoryst = "noHighlightBtn";
    this.basicDetail = "noHighlightBtn";
    this.injectionHistory = "highlightBtn";
  }

  viewDetail(i: any, template: TemplateRef<any>){
    console.log("i",JSON.stringify(i));
    this.medications = i.medications;
    this.nutrition = i.nutrition;
    this.examination_date = i.examination_date;
    this.symptom_description = i.symptom_description;
    this.symptoms_time = i.symptoms_time;
    this.body_temperature = i.body_temperature;
    this.test_results = i.test_results;
    this.re_examination = i.re_examination;
    this.petRecordId = i.id;
    this.meeting = i.doctorDto.link_meet;
    console.log("this.meeting",this.meeting);

    this.modalRef = this.modalService.show(template);
  }

  openAddVacination(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
  }

  addVaccinateHistory(){
    const user_id = Number(localStorage.getItem('user_id'));
    this.vaccineHistory = new VaccineHistory(this.petId, this.descriptionVacineHistory, this.urlVaccineImage, this.vaccine, this.injection_date);
    this.http.post<any>(`${BASE_URL}/vacinationHistory/add`, {
      ...this.vaccineHistory,
      "customer-id": user_id,
      customer_id: user_id,
    }).subscribe(
      (res) => {
        setTimeout(() => {
          this.getVacinationHistory();
        }, 1000)
        this.toastService.success('Thêm lịch sử tiêm vaccine thành công');
        this.modalRef?.hide();
      },
      (err) => {}
    );
  }

  loadingStatusFileVaccination: any;
  async onFileChangeVaccine(event:any){

    this.loadingStatusFileVaccination = true;
    const file = event.target.files[0];
    if (file) {
      const path = `yt/${file.name}`;
      try {
        const uploadTask = await this.fireStorage.upload(path, file);
        this.urlVaccineImage = await uploadTask.ref.getDownloadURL();
      } catch (error) {
        console.error("Error uploading certificate:", error);
      } finally {
        this.loadingStatusFileVaccination = false;
      }
    } else {
      this.loadingStatusFileVaccination = false;
    }

  }

  closeDialog(){
    this.modalRef?.hide();
  }

  navigatePage() {
    this.router.navigate([`/my-service/${this.petRecordId}`]);
    this.modalRef?.hide();
  }
}
