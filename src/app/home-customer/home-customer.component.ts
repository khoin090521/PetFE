import { Component, OnInit, TemplateRef, NgZone, HostListener, Renderer2 } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscriber, of } from 'rxjs';
import { BASE_URL } from '../_common/constants/api';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';
import { Router, NavigationExtras } from '@angular/router';
import { map, finalize } from "rxjs/operators";



interface UserList {
  gmail: string;
  full_name: string;
  address: string;
  phone_number: string;
  roles: string[];
  status: number;
}

class Pet{
  constructor(
    public name: string,
    public age: number,
    public gender: boolean,
    public species: string,
    public identifying: string,
    public origin_certificate: string,
    public transfer_contract: string,
    public health_history_requests: {},
    public customer_pet_requests: {}
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

export interface HealthHistoryRequest {
  description: string;
}

class CustomerPetRequest {
  constructor(
    public customer_id: number,
    public status: string,
  ){}
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
  selector: 'app-home-customer',
  templateUrl: './home-customer.component.html',
  styleUrls: ['./home-customer.component.scss']
})

export class HomeCustomerComponent implements OnInit{

  modalRef?: BsModalRef;
  myImage!: Observable<any>;
  rightPopupIndex: number = 1;
  name: string = "";
  species: string = "";
  gender: boolean = true;
  age: number = 0;
  identifying: string = "";
  
  transfer_contract: string = "";
  origin_certificate: string = "";

  pet?: Pet;
  vaccineHistory?: VaccineHistory;
  petList: any;



  descriptionHealthHistory: string = "";
  descriptionVacineHistory: string = "";

  searchResults?: SearchResult[] | null;

  health_history_requests:{}  = {};
  customer_pet_requests:{} = {};

  vaccine: string = "";
  vacineHistory: string = "";
  injection_date: string = "";
  customer_id: number = 1;
  status: string = "";
  userList?: UserList[] = [];

  petId: number = 0;
  petName: string = "";
  petRemoveId: number = 0;

  urlPetImage: any = null;
  urlVaccineImage: any = null;

  constructor(
    private modalService: BsModalService,
    private http: HttpClient,
    private headerComponent: HeaderComponent,
    private toastService: ToastrService,
    private router: Router,
    private renderer: Renderer2,
    private fireStorage:AngularFireStorage
  ){
  }

  ngOnInit(): void {    
    this.getListPetByUserId();
  }

  async getListPetByUserId(){
    var userId = localStorage.getItem('user_id');
    await this.http.get<any>(`${BASE_URL}/pet/list?index-page=1&size=100&customer-id=`+userId).subscribe(
      (res) => {
        this.petList = res.data.content
        console.log("petList",this.petList);
      },
      (err) => {
        
      }
    );
  }

  async onFileChange(event:any){
    const file = event.target.files[0]
    if(file){
      const path = `yt/${file.name}`
      const uploadTask =await this.fireStorage.upload(path,file)
      this.urlPetImage = await uploadTask.ref.getDownloadURL();
    }
  }

  async onFileChangeCertificate(event:any){
    const file = event.target.files[0]
    if(file){
      const path = `yt/${file.name}`
      const uploadTask =await this.fireStorage.upload(path,file)
      this.origin_certificate = await uploadTask.ref.getDownloadURL();
    }
  }

  async onFileChangeVaccine(event:any){
    const file = event.target.files[0]
    if(file){
      const path = `yt/${file.name}`
      const uploadTask =await this.fireStorage.upload(path,file)
      this.urlVaccineImage = await uploadTask.ref.getDownloadURL();
    }
  }
  
  async onSearch() {
    const response = await this.http.get<SearchResult[]>(`${BASE_URL}/search/user?search=${this.headerComponent.searchName}`).toPromise();
    this.searchResults = response;
    console.log("searchResults",JSON.stringify(this.searchResults));
  }

  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement; // Type assertion
    if (inputElement && inputElement.classList.contains('search-input')) {
      this.onSearch();
    }
  }

  addRecord(){

  }

  insertRecord(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  async onChange($event: any) {
    const target = $event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.convertToBase64(file);
  }

  convertToBase64(file: File) {
    const observable = new Observable((subsciber: Subscriber<any>) => {
      this.readFile(file, subsciber)
    })
    observable.subscribe((d) => {
      console.log(d);
      this.myImage = d;
    })
  }

  readFile(file: File, subsciber: Subscriber<any>) {
    const filereader = new FileReader();
    filereader.readAsDataURL(file);
    filereader.onload = () => {
      subsciber.next(filereader.result);
      subsciber.complete();
    }
    filereader.onerror = () => {
      subsciber.error();
      subsciber.complete();
    }
  }

  nextRecord(){
    this.modalRef?.hide();
    this.addPet();
    if(this.rightPopupIndex < 3){
      this.rightPopupIndex++;
    }
  }

  addPet(){
    if(this.rightPopupIndex === 2){

      this.health_history_requests = {
        description: this.descriptionHealthHistory
      };
  
      this.customer_pet_requests = {
        customer_id: localStorage.getItem('user_id'),
        status:"sdashdsajgda ???"
      };

      this.pet = new Pet(this.name, this.age, this.gender, this.species, this.identifying, this.origin_certificate, this.urlPetImage, this.health_history_requests, this.customer_pet_requests);
      this.http.post<any>(`${BASE_URL}/pet/add`, this.pet).subscribe(
        (res) => {
          this.petId = res.data.id
        },
        (err) => {}
      );
    }
  }

  addVaccinateHistory(){
    this.vaccineHistory = new VaccineHistory(this.petId, this.descriptionVacineHistory, this.urlVaccineImage, this.vaccine, this.injection_date);
    console.log("vaccineHistory",JSON.stringify(this.vaccineHistory));
    this.http.post<any>(`${BASE_URL}/vacinationHistory/add`, this.vaccineHistory).subscribe(
      (res) => {
        this.getListPetByUserId();
        this.toastService.success('Thêm lịch sử tiêm vaccine thành công');
      },
      (err) => {}
    );

    const modal = document.getElementById('myModal2');
    this.renderer.removeClass(modal, 'show');
    this.renderer.setAttribute(modal, 'aria-hidden', 'true');
    this.renderer.setStyle(modal, 'display', 'none');
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      this.renderer.removeChild(document.body, backdrop);
    }
  }

  removePet(id: any, name: any, template: TemplateRef<any>){
    console.log("id",id);
    this.petName = name;
    this.petRemoveId = id;
    this.modalRef = this.modalService.show(template);
  }

  removePetAccept(){
    this.http.delete<any>(`${BASE_URL}/pet/delete?pet-id=`+this.petRemoveId).subscribe(
      (res) => {
        this.modalRef?.hide();
        this.toastService.success('Xoá thành công');
      },
      (err) => {}
    );
  }

  viewDetail(pet: any){
    this.modalRef?.hide();
    const navigationExtras: NavigationExtras = {
      queryParams: { petId: pet.id, name: pet.name, age: pet.age, gender: pet.gender, 
        species: pet.species , identifying: pet.identifying, image: pet.transfer_contract}
    };
    this.router.navigate(['/detail-pet'], navigationExtras);
  }

}
