import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-create-doctor',
  templateUrl: './create-doctor.component.html',
  styleUrls: ['./create-doctor.component.scss']
})
export class CreateDoctorComponent implements OnInit{

  modalRef?: BsModalRef;
  openMedicineScreen: any = false;
  createDoctorMeeting: any = false;

  foods: Food[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];

  constructor(
    private modalService: BsModalService
  ){}

  ngOnInit(): void {
  }


  openCreateDoctor(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  closeLoginForm() {
    this.modalRef?.hide();
  }

  openMedicine(){
    this.openMedicineScreen = true;
  }

  openCreateMeeting(template: TemplateRef<any>){
    // this.createDoctorMeeting = true;
    this.modalRef = this.modalService.show(template);

  }

}
