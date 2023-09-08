import { Component, OnInit } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-listed-plans',
  templateUrl: './listed-plans.component.html',
  styleUrls: ['./listed-plans.component.css']
})
export class ListedPlansComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $("html, body").animate({ scrollTop: 0 }, 600);
  }

}
