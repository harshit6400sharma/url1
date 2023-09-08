import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { constant } from '../constant';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false); // {1}
  private quotepage = new BehaviorSubject<boolean>(false);
  errorMsg: any;


  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable(); // {2}
  }

  get isHomepage2(): Observable<boolean> {
    return this.quotepage.asObservable(); // {2}
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) { }

  private handleError(error: HttpErrorResponse) {
    return throwError(error.error);
  };


  login() {
    this.loggedIn.next(true);
  }

  homepage2(){
    this.quotepage.next(true);
  }

  logout() {
    setTimeout(() => {
      console.log("XXXXXXXXXXXXXX")
      this.loggedIn.next(false);
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('pmtoken');
      localStorage.removeItem('fname');
      localStorage.removeItem('user_Id');
      this.router.navigate(['/home']);
    }, 10)
  }

  changeLoginStatus(s: boolean) {
    setTimeout(() => {
      this.loggedIn.next(s);
    }, 10)
  }

  // forgotPass(email) {
  //   let data = {
  //     email: email
  //   };
  //   return this.http.post<any>(environment.api_url + 'forgotpassword', data)
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  // creating an Observable manually

  tokenValidate(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.demoLoginChecker().subscribe(status => {
        console.log(status)
        if (status) {
          resolve(status)
        } else {
          localStorage.setItem('loggedIn', '0');
          this.router.navigate(['/login']);
          reject()
        }
      })
    })

  }

  public demoLoginChecker(): Observable<any> {
    const studentsObservable = new Observable(observer => {
      setTimeout(() => {
        observer.next(1);
        observer.complete();
      }, 5000);
    });

    return studentsObservable;
  }

}
