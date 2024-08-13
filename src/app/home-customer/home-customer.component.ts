import { Component, OnInit, TemplateRef, NgZone, HostListener } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscriber, of } from 'rxjs';
import { BASE_URL } from '../_common/constants/api';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';

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
    public health_history_requests: HealthHistoryRequest,
    public vacination_history_requests: VaccinationHistoryRequest,
    public customer_pet_requests: CustomerPetRequest
  ) {}
}

class HealthHistoryRequest {
  constructor(
    public description: string,
    ){}
}

class VaccinationHistoryRequest {
  constructor(
    public name: string,
    public description: string,
    public injection_date: string,
  ){}
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
  age: number = 1;
  identifying: string = "";
  
  transfer_contract: string = "";
  origin_certificate: string = "";

  pet?: Pet;



  descriptionHealthHistory: string = "";
  descriptionVacineHistory: string = "";
  searchResults?: SearchResult[] | null;

  vaccine: string = "";
  vacineHistory: string = "";
  injection_date: string = "";
  customer_id: number = 1;
  status: string = "";
  userList?: UserList[] = [];

  constructor(
    private modalService: BsModalService,
    private http: HttpClient,
    private headerComponent: HeaderComponent
  ){
  }

  ngOnInit(): void {    
  }
  
  async onSearch() {
    const response = await this.http.get<SearchResult[]>(`${BASE_URL}/search/user?search=${this.headerComponent.searchName}`).toPromise();
    this.searchResults = response;

    console.log("response", JSON.stringify(this.searchResults));
  }

  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement; // Type assertion
    if (inputElement && inputElement.classList.contains('search-input')) {
      this.onSearch();
    }
  }

  insertRecord(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  onChange($event: Event) {
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
    if(this.rightPopupIndex < 3){
      this.rightPopupIndex++;
    }
  }

  addPet(){}

  // addPet(){
  //   this.healthHistoryRequests = new HealthHistoryRequest(this.descriptionHealthHistory);
  //   this.vacinationHistoryRequests = new VaccinationHistoryRequest(this.vaccine, this.descriptionVacineHistory, this.injection_date);
  //   this.customerPetRequests = new CustomerPetRequest(this.customer_id, this.status);

  //   this.pet = new Pet(this.name, this.age, this.gender, this.species, this.identifying, this.origin_certificate,
  //     this.transfer_contract, 
  //     this.healthHistoryRequests,
  //     this.vacinationHistoryRequests, 
  //     this.customerPetRequests
  //   );

  //   this.savePet(this.pet).subscribe(
  //     (res) => {

  //     });
  // }

  // savePet(pet: Pet): Observable<any>{
  //   return this.http.post<any>(`${BASE_URL}/pet/add`, pet);
  // }

}
