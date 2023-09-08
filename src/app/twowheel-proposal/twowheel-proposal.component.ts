import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';



@Component({
  selector: 'app-twowheel-proposal',
  templateUrl: './twowheel-proposal.component.html',
  styleUrls: ['./twowheel-proposal.component.css'],

})
export class TwowheelProposalComponent implements OnInit {

  modalRef: BsModalRef;
  @ViewChild('successmodal', { static: true }) successmodal: BsModalRef

  @ViewChild('successmodal1', { static: true }) successmodal1: BsModalRef
  
  constructor(    private modalService: BsModalService,
    ) { }

  ngOnInit() {


    
  }
  buynow(){
      this.modalRef = this.modalService.show(this.successmodal, { class: 'common-popup' });

  }

  submit(){
    this.modalRef = this.modalService.show(this.successmodal1, { class: 'common-popup' });
  }



}
