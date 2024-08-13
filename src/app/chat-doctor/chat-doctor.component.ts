import { Component, OnInit, HostListener } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BASE_URL } from '../_common/constants/api';
import { HeaderComponent } from '../header/header.component';


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
  gmail: string;
  full_name: string;
  address: string;
  phone_number: string;
  roles: string[];
  status: number;
}

@Component({
  selector: 'app-chat-doctor',
  templateUrl: './chat-doctor.component.html',
  styleUrls: ['./chat-doctor.component.scss']
})
export class ChatDoctorComponent implements OnInit{

  constructor(
    private http: HttpClient,
    private headerComponent: HeaderComponent
  ){
  }

  openContactScreen: any = true;
  openAddRecord: any = false;
  openSchedule: any = false;
  displayedDiagnostic: string[] = ['position', 'date', 'name', 'diagnostic','id'];
  dataSource = DISAGNOSTIC_DATA;

  displayedSchedule: string[] = ['schedule', 'detail', 'status', 'id'];
  dataSourceSchedule = SCHEDULE_DATA;

  // dataSourceSchedule = null;

  profileBtn: string = "profile-btn";
  erecordBtn: string = "erecord-btn";
  searchResults?: SearchResult[] | null;

  transistionStatus: number = 1;

  ngOnInit(): void {
    this.getSchedule();
  }

  async onSearch() {
    const response = await this.http.get<SearchResult[]>(`${BASE_URL}/search/user?search=${this.headerComponent.searchName}`).toPromise();
    this.searchResults = response;
  }

  @HostListener('document:keydown.enter', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    const inputElement = event.target as HTMLInputElement; // Type assertion
    if (inputElement && inputElement.classList.contains('search-input')) {
      this.onSearch();
    }
  }

  async getSchedule(){
    const response = await this.http.get<any>(`${BASE_URL}/booking/list?doctor-id=1`).toPromise();
    console.log("response",response.data);
    this.dataSourceSchedule = response;
  }

  contact(){
    this.openContactScreen = true;
    this.openAddRecord = false;
    this.openSchedule = false;
  }

  add_record(){
    this.openAddRecord = true;
    this.openContactScreen = false;
    this.openSchedule = false;
  }

  open_schedule(){
    this.openSchedule = true;
    this.openContactScreen = false;
    this.openAddRecord = false;
  }

  openProfile(){
    if(this.transistionStatus == 1){
      this.profileBtn = "profile-btn";
      this.erecordBtn = "erecord-btn";
    }else if(this.transistionStatus == 0){
      this.erecordBtn = "profile-btn";
      this.profileBtn = "erecord-btn";
    }
  }

  openERecord(){
    if(this.transistionStatus == 0){
      this.erecordBtn = "erecord-btn";
      this.profileBtn = "profile-btn";
    }else if(this.transistionStatus == 1){
      this.erecordBtn = "profile-btn";
      this.profileBtn = "erecord-btn";
    }
  }

}
