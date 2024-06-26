import { Component, OnInit, TemplateRef, NgZone } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscriber, of } from 'rxjs';

@Component({
  selector: 'app-home-customer',
  templateUrl: './home-customer.component.html',
  styleUrls: ['./home-customer.component.scss']
})
export class HomeCustomerComponent implements OnInit{

  modalRef?: BsModalRef;
  myImage!: Observable<any>;
  rightPopupIndex: number = 1;

  constructor(
    private modalService: BsModalService
  ){}

  ngOnInit(): void {
    // this.myImage = of("https://i.pinimg.com/474x/d7/70/33/d7703333ad8ba85827b60fccf42f9c25.jpg");
  }

  insertRecord(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  onChange($event: Event) {
    const target = $event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    console.log(file);
    this.convertToBase64(file);
  }

  convertToBase64(file: File) {
    const observable = new Observable((subsciber: Subscriber<any>) => {
      this.readFile(file, subsciber)
    })
    observable.subscribe((d) => {
      console.log(d);
      this.myImage = d;
      // this.base64code = d;
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

}
