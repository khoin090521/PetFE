import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';

export interface PeriodicElement {
  doctor: string;
  date: any;
  diagnose: string;
  detail: string;
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
export class DetailPetComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource123: any = ELEMENT_DATA;

  statusTab: boolean = true;
  profiltTabStatus: number = 1;

  profileBtn: string = "profile-btn";
  erecordBtn: string = "erecord-btn";

  transistionStatus: number = 1;


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
