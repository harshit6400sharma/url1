import { Component, OnInit } from '@angular/core';

declare var $:any;
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $("html, body").animate({ scrollTop: 0 }, 600);
  }

}
