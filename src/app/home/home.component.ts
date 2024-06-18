import { Component, OnInit, TemplateRef } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import {MatGridListModule} from '@angular/material/grid-list';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit{

  
  ngOnInit(): void {}
  constructor(public dialog: MatDialog,
    public http: HttpClient) {};

  count: number = 2.2;
  date: any;
  qr: string = "";
  data: any;


  showQR() :void{
    this.qr="https://qr.sepay.vn/img?acc=0010000000355&bank=Vietcombank";
    }
}
