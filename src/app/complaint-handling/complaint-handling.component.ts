import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-complaint-handling',
  templateUrl: './complaint-handling.component.html',
  styleUrls: ['./complaint-handling.component.css']
})
export class ComplaintHandlingComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $("html, body").animate({ scrollTop: 0 }, 600);
  }

}
