import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  downloadLicense() {
    // const blob = new Blob([data], { type: 'text/csv' });
    // const url = window.URL.createObjectURL(blob);
    // window.open(url);
  }

  ourPartner() {
    this.router.navigate([`home`], { queryParams: { scrollto: 'ourpartner' } });
  }

}
