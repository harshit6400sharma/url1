import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-privecypolicy',
  templateUrl: './privecypolicy.component.html',
  styleUrls: ['./privecypolicy.component.css']
})
export class PrivecypolicyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $("html, body").animate({ scrollTop: 0 }, 600);
  }

}
