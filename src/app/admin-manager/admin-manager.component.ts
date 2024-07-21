import { Component, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


export interface PeriodicElement {
  id: string,
  name: string;
  gmail: string;
  phone: string;
  position: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Nguyễn Minh Nam', gmail: 'chien123@gmail.com', phone: '0123456789', position: 'Bác sĩ', status: 'Cấm', id: '1'},
  {name: 'Nguyễn Minh Quang', gmail: 'chien123@gmail.com', phone: '0123456789', position: 'Bác sĩ', status: 'Cấm', id: '2'},
  {name: 'Hydrogen', gmail: 'chien123@gmail.com', phone: '0123456789', position: 'Bác sĩ', status: 'Cấm', id: '3'},
];



@Component({
  selector: 'app-admin-manager',
  templateUrl: './admin-manager.component.html',
  styleUrls: ['./admin-manager.component.scss']
})
export class AdminManagerComponent {

  displayedColumns: string[] = ['name', 'gmail', 'phone', 'position', 'status', 'id'];
  dataSource = ELEMENT_DATA;
  modalRef?: BsModalRef;

  constructor(
    private modalService: BsModalService
  ){}


  createHost(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
  }

  closeLoginForm() {
    this.modalRef?.hide();
  }

}
