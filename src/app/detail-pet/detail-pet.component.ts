import { Component, OnInit } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { BASE_URL } from '../_common/constants/api';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';



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
  healthPetList: any;
  recordPetList: any;
  descriptionHealth: any;
  healthHistory?: HealthHistory;

  async ngAfterViewInit() {
    const routerUrl = window.location.href
    console.log("routerUrl",routerUrl);
    const urlObj = new URL(routerUrl);

    this.petId = Number(urlObj.searchParams.get('petId') || '');
    const name = urlObj.searchParams.get('name') || '';
    const age = urlObj.searchParams.get('age') || ''; 
    const gender = urlObj.searchParams.get('gender') || '';
    const species = urlObj.searchParams.get('species') || '';
    const identifying = urlObj.searchParams.get('identifying') || '';
    const image = urlObj.searchParams.get('image') || '';
    console.log("this.petId",this.petId);

    setTimeout(() => {
        this.petName = decodeURIComponent(name);
        this.petAge = decodeURIComponent(age);
        this.petGender = decodeURIComponent(gender);
        this.petSpecies = decodeURIComponent(species);
        this.petIdentifying = decodeURIComponent(identifying);
        this.imagePet = image;
      }, 500)
  }

  constructor(
    private http: HttpClient,
  ){
  }

  ngOnInit(): void {    
    setTimeout(() => {
      this.getHeathPet();
      this.getRecordPet();
    }, 1000)
  }


  getHeathPet(){
    this.http.get<any>(`${BASE_URL}/healthHistory/list?pet-id=${this.petId}`).subscribe(
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
    this.healthHistory = new HealthHistory(this.petId, this.descriptionHealth);
    console.log("123",this.healthHistory);
    this.http.post<any>(`${BASE_URL}/healthHistory/add`,this.healthHistory).subscribe(
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

  openBasicDetail(){
    this.profiltTabStatus = 1;
  }

  openHealthHistory(){
    this.profiltTabStatus = 2;
  }

  openInjectionhHistory(){
    this.profiltTabStatus = 3;
  }

}
