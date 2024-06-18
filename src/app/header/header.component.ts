import { Component, OnInit, TemplateRef, NgZone } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{

  modalRef?: BsModalRef;
  registerStatus: any = false;
  forgotPasswordStatus: boolean = false;
  
  constructor(
    private modalService: BsModalService
  ){}

  ngOnInit(): void {
  }

  openLoginForm(template: TemplateRef<any>) {
    this.registerStatus = false;
    this.forgotPasswordStatus = false;
    this.modalRef = this.modalService.show(template);
  }

  openRegisterForm(){
    this.registerStatus = true;
  }

  findAccount(){
    this.forgotPasswordStatus = true;
    this.registerStatus = null;
  }

  closeLoginForm() {
    this.forgotPasswordStatus = false;
    this.registerStatus = null;
    this.modalRef?.hide();
  }

}
