import { Component, OnInit } from '@angular/core';
import {MatTableModule} from '@angular/material/table';

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


@Component({
  selector: 'app-chat-doctor',
  templateUrl: './chat-doctor.component.html',
  styleUrls: ['./chat-doctor.component.scss']
})
export class ChatDoctorComponent implements OnInit{

  openContactScreen: any = true;
  openAddRecord: any = false;
  openSchedule: any = false;
  displayedDiagnostic: string[] = ['position', 'date', 'name', 'diagnostic','id'];
  dataSource = DISAGNOSTIC_DATA;

  displayedSchedule: string[] = ['schedule', 'detail', 'status', 'id'];
  dataSourceSchedule = SCHEDULE_DATA;

  ngOnInit(): void {
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

}
