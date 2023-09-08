import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
//import { environment } from '../../environments/environment';
import { constant } from '../constant';

@Injectable({
  providedIn: 'root',
})
export class CommonService {

  constructor(
    private _http: HttpClient
  ) { }

  gettoken() {
    return !!localStorage.getItem("token");
  }


  setHeader() {
    const token = localStorage.getItem('token');
    const httpOptions = {
      headers: new HttpHeaders({
        'X-XSS-Protection': '1; mode=block',
        'X-Frame-Options': 'deny',
        'AUTHORIZATION': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNiMDIyNzQwLTEzNjYtMTFlYi1iMzlmLTg5Njg5ZDIzN2I5ZiIsImlhdCI6MTYwNTY3ODUyOSwiZXhwIjoxNjA2MjgzMzI5fQ.msjC-51lx-2uXmcN3cw2RmOT8_CEfwxWCoaQSqr-pic`
      })
    };
    return httpOptions;
  }
  

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  };

  get(url): Observable<any> {
    return this._http.get(
      constant.api_endpoint + url, this.setHeader()
    ).pipe(
      retry(3),// retry a failed request up to 3 times
      catchError(this.handleError) // then handle the error
    );
  }

  post(url, data): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this._http.post<any>(url, data, { headers })
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  createbitlyshortlink(data): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        "Authorization": `Bearer ${constant.bitly_access_token}`,
        "Content-Type": 'application/json'
      })
    };
    return this._http.post(
      constant.bitly_endpoint, data, httpOptions
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  postSTAR(url, data): Observable<any> {
    return this._http.post(
      constant.api_endpoint + url, data
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  postdirect(url, data): Observable<any> {
    return this._http.post(
      url, data
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  religareCreatePolicy(data): Observable<any> {
    const url = constant.religare_endpoint + '/relinterfacerestful/religare/restful/createPolicy';
    const httpOptions = {
      headers: new HttpHeaders({
        'appID': '554940',
        'signature': 'VLwAATi/myXGqlG9C14DVIKsLgFjEUAZIizPSIbVdJw=',
        'timestamp': '1545391069685'
      })
    };
    return this._http.post(
      url, data, httpOptions
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }


  adityaCreatePolicy(data): Observable<any> {
    const url = constant.aditya_endpoint + '/ABHICL_FullQuoteNSTP/Service1.svc/GenericFullQuote';
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'AppID': '554940',
    //     'Signature': 'VLwAATi/myXGqlG9C14DVIKsLgFjEUAZIizPSIbVdJw=',
    //     'TimeStamp': '1545391069685'
    //   })
    // };
    return this._http.post(
      url, data,
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  put(url, data): Observable<any> {
    return this._http.put(
      constant.api_endpoint + url, data, this.setHeader()
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  delete(url): Observable<any> {
    return this._http.delete(
      constant.api_endpoint + url, this.setHeader()
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  photoUpload(url, data): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'X-XSS-Protection': '1; mode=block',
        'AUTHORIZATION': `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNiMDIyNzQwLTEzNjYtMTFlYi1iMzlmLTg5Njg5ZDIzN2I5ZiIsImlhdCI6MTYwNTY3ODUyOSwiZXhwIjoxNjA2MjgzMzI5fQ.msjC-51lx-2uXmcN3cw2RmOT8_CEfwxWCoaQSqr-pic`
      })
    };
    return this._http.post(
      constant.api_endpoint + url, data, httpOptions
    )
      .pipe(
        catchError(this.handleError) // then handle the error
      );
  }

  relations() {
    return [
      {
        key: 'Individual', value: '1a', totalmember: 1, nochild: 0, form: [
          {
            membertype: '1a', memberTypeDef: 'Insured Member', relations: [
              { key: 'self', value: 'Self' }, { key: 'spouse', value: 'Spouse' }, { key: 'father', value: 'Father' }, { key: 'mother', value: 'Mother' }, { key: 'mother-in-law', value: 'Mother-In-Law' }, { key: 'father-in-law', value: 'Father-In-Law' }
            ]
          }
        ]
      },
      {
        key: '1 Adult, 1 Child', value: '1a-1c', totalmember: 2, nochild: 1, form: [
          {
            membertype: '1a', memberTypeDef: 'Insured Member', relations: [
              { key: 'self', value: 'Self' }, { key: 'spouse', value: 'Spouse' }, { key: 'father', value: 'Father' }, { key: 'mother', value: 'Mother' }, { key: 'mother-in-law', value: 'Mother-In-Law' }, { key: 'father-in-law', value: 'Father-In-Law' }
            ]
          },
          {
            membertype: '1c', memberTypeDef: 'Dependent Child', relations: [
              { key: 'son', value: 'Son' }, { key: 'daughter', value: 'Daughter' }
            ]
          }
        ]
      },
      {
        key: '1 Adult + 2 Children', value: '1a-2c', totalmember: 3, nochild: 2, form: [
          {
            membertype: '1a', memberTypeDef: 'Insured Member', relations: [
              { key: 'self', value: 'Self' }, { key: 'spouse', value: 'Spouse' }, { key: 'father', value: 'Father' }, { key: 'mother', value: 'Mother' }, { key: 'mother-in-law', value: 'Mother-In-Law' }, { key: 'father-in-law', value: 'Father-In-Law' }
            ]
          },
          {
            membertype: '1c', memberTypeDef: 'Dependent Child', relations: [
              { key: 'son', value: 'Son' }, { key: 'daughter', value: 'Daughter' }
            ]
          },
          {
            membertype: '1c', memberTypeDef: 'Dependent Child', relations: [
              { key: 'son', value: 'Son' }, { key: 'daughter', value: 'Daughter' }
            ]
          }
        ]
      },
      {
        key: '1 Adult + 3 Children', value: '1a-3c', totalmember: 4, nochild: 3, form: [
          {
            membertype: '1a', memberTypeDef: 'Insured Member', relations: [
              { key: 'self', value: 'Self' }, { key: 'spouse', value: 'Spouse' }, { key: 'father', value: 'Father' }, { key: 'mother', value: 'Mother' }, { key: 'mother-in-law', value: 'Mother-In-Law' }, { key: 'father-in-law', value: 'Father-In-Law' }
            ]
          },
          {
            membertype: '1c', memberTypeDef: 'Dependent Child 1', relations: [
              { key: 'son', value: 'Son' }, { key: 'daughter', value: 'Daughter' }
            ]
          },
          {
            membertype: '1c', memberTypeDef: 'Dependent Child 2', relations: [
              { key: 'son', value: 'Son' }, { key: 'daughter', value: 'Daughter' }
            ]
          },
          {
            membertype: '1c', memberTypeDef: 'Dependent Child 3', relations: [
              { key: 'son', value: 'Son' }, { key: 'daughter', value: 'Daughter' }
            ]
          }
        ]
      },
      {
        key: '2 Adult', value: '2a', totalmember: 2, nochild: 0, form: [
          {
            membertype: '1a', memberTypeDef: 'Insured Member 1', relations: [
              { key: 'self', value: 'Self' }, { key: 'spouse', value: 'Spouse' }, { key: 'father', value: 'Father' }, { key: 'mother', value: 'Mother' }, { key: 'mother-in-law', value: 'Mother-In-Law' }, { key: 'father-in-law', value: 'Father-In-Law' }
            ]
          },
          {
            membertype: '1a', memberTypeDef: 'Insured Member 2', relations: [
              { key: 'self', value: 'Self' }, { key: 'spouse', value: 'Spouse' }, { key: 'father', value: 'Father' }, { key: 'mother', value: 'Mother' }, { key: 'mother-in-law', value: 'Mother-In-Law' }, { key: 'father-in-law', value: 'Father-In-Law' }
            ]
          }
        ]
      },
      {
        key: '2 Adult + 1 Child', value: '2a-1c', totalmember: 3, nochild: 1, form: [
          {
            membertype: '1a', memberTypeDef: 'Insured Member 1', relations: [
              { key: 'self', value: 'Self' }, { key: 'spouse', value: 'Spouse' }, { key: 'father', value: 'Father' }, { key: 'mother', value: 'Mother' }, { key: 'mother-in-law', value: 'Mother-In-Law' }, { key: 'father-in-law', value: 'Father-In-Law' }
            ]
          },
          {
            membertype: '1a', memberTypeDef: 'Insured Member 2', relations: [
              { key: 'self', value: 'Self' }, { key: 'spouse', value: 'Spouse' }, { key: 'father', value: 'Father' }, { key: 'mother', value: 'Mother' }, { key: 'mother-in-law', value: 'Mother-In-Law' }, { key: 'father-in-law', value: 'Father-In-Law' }
            ]
          },
          {
            membertype: '1c', memberTypeDef: 'Dependent Child', relations: [
              { key: 'son', value: 'Son' }, { key: 'daughter', value: 'Daughter' }
            ]
          }
        ]
      },
      {
        key: '2 Adult + 2 Children', value: '2a-2c', totalmember: 4, nochild: 2, form: [
          {
            membertype: '1a', memberTypeDef: 'Insured Member 1', relations: [
              { key: 'self', value: 'Self' }, { key: 'spouse', value: 'Spouse' }, { key: 'father', value: 'Father' }, { key: 'mother', value: 'Mother' }, { key: 'mother-in-law', value: 'Mother-In-Law' }, { key: 'father-in-law', value: 'Father-In-Law' }
            ]
          },
          {
            membertype: '1a', memberTypeDef: 'Insured Member 2', relations: [
              { key: 'self', value: 'Self' }, { key: 'spouse', value: 'Spouse' }, { key: 'father', value: 'Father' }, { key: 'mother', value: 'Mother' }, { key: 'mother-in-law', value: 'Mother-In-Law' }, { key: 'father-in-law', value: 'Father-In-Law' }
            ]
          },
          {
            membertype: '1c', memberTypeDef: 'Dependent Child 1', relations: [
              { key: 'son', value: 'Son' }, { key: 'daughter', value: 'Daughter' }
            ]
          },
          {
            membertype: '1c', memberTypeDef: 'Dependent Child 2', relations: [
              { key: 'son', value: 'Son' }, { key: 'daughter', value: 'Daughter' }
            ]
          }
        ]
      },
      {
        key: '2 Adult + 3 Children', value: '2a-3c', totalmember: 5, nochild: 3, form: [
          {
            membertype: '1a', memberTypeDef: 'Insured Member 1', relations: [
              { key: 'self', value: 'Self' }, { key: 'spouse', value: 'Spouse' }, { key: 'father', value: 'Father' }, { key: 'mother', value: 'Mother' }, { key: 'mother-in-law', value: 'Mother-In-Law' }, { key: 'father-in-law', value: 'Father-In-Law' }
            ]
          },
          {
            membertype: '1a', memberTypeDef: 'Insured Member 2', relations: [
              { key: 'self', value: 'Self' }, { key: 'spouse', value: 'Spouse' }, { key: 'father', value: 'Father' }, { key: 'mother', value: 'Mother' }, { key: 'mother-in-law', value: 'Mother-In-Law' }, { key: 'father-in-law', value: 'Father-In-Law' }
            ]
          },
          {
            membertype: '1c', memberTypeDef: 'Dependent Child 1', relations: [
              { key: 'son', value: 'Son' }, { key: 'daughter', value: 'Daughter' }
            ]
          },
          {
            membertype: '1c', memberTypeDef: 'Dependent Child 2', relations: [
              { key: 'son', value: 'Son' }, { key: 'daughter', value: 'Daughter' }
            ]
          },
          {
            membertype: '1c', memberTypeDef: 'Dependent Child 3', relations: [
              { key: 'son', value: 'Son' }, { key: 'daughter', value: 'Daughter' }
            ]
          }
        ]
      },
    ];
  }

  relationValue(a, c) {
    if (a == 1 && c == 0) {
      return '1a';
    } else if (a == 1 && c == 1) {
      return '1a-1c';
    } else if (a == 1 && c == 2) {
      return '1a-2c';
    } else if (a == 1 && c == 3) {
      return '1a-3c';
    } else if (a == 1 && c == 4) {
      return '1a-4c';
    } else if (a == 2 && c == 1) {
      return '2a-1c';
    } else if (a == 2 && c == 2) {
      return '2a-2c';
    } else if (a == 2 && c == 3) {
      return '2a-3c'
    } else if (a == 2 && c == 4) {
      return '2a-4c';
    } else if (a == 2 && c == 0) {
      return '2a';
    } else {
      return '2a';
    }
  }

  nomineeRelations() {
    return [
      {
        key: 'Brother',
        value: 'Brother'
      }, {
        key: 'Brother-in-law',
        value: 'Brother-in-law'
      }, {
        key: 'Daughter',
        value: 'Daughter'
      }, {
        key: 'Daughter-in-law',
        value: 'Daughter-in-law'
      },
      {
        key: 'Father',
        value: 'Father'
      },
      {
        key: 'Father-in-law',
        value: 'Father-in-law'
      },
      {
        key: 'Granddaughter',
        value: 'Granddaughter'
      }, {
        key: 'Grandfather',
        value: 'Grandfather'
      },
      {
        key: 'Grandmother',
        value: 'Grandmother'
      },
      {
        key: 'Grandson',
        value: 'Grandson'
      },
      {
        key: 'Mother',
        value: 'Mother'
      },
      {
        key: 'Sister',
        value: 'Sister'
      },
      {
        key: 'Sister-in-law',
        value: 'Sister-in-law'
      }, {
        key: 'Son',
        value: 'Son'
      }, {
        key: 'Son-in-law',
        value: 'Son-in-law'
      }, {
        key: 'Spouse',
        value: 'Spouse'
      }, {
        key: 'Other',
        value: 'Other'
      }
    ]
  }

  abhiNomineeRel() {
    return [
      {
        key: 'R001',
        value: 'Self'
      }, {
        key: 'R002',
        value: 'Spouse'
      }, {
        key: 'R003',
        value: 'Dependent Son'
      }, {
        key: 'R004',
        value: 'Dependent Daughter'
      },
      {
        key: 'R005',
        value: 'Mother'
      },
      {
        key: 'R006',
        value: 'Father'
      },
      {
        key: 'R007',
        value: 'Mother-in-law'
      },
      {
        key: 'R008',
        value: 'Father-in-law'
      },
      {
        key: 'R009',
        value: 'Brother'
      },
      {
        key: 'R010',
        value: 'Sister'
      },
      {
        key: 'R011',
        value: 'Grandfather'
      },
      {
        key: 'R012',
        value: 'Grandmother'
      },
      {
        key: 'R013',
        value: 'Grandson'
      }, {
        key: 'R014',
        value: 'Granddaughter'
      },
      {
        key: 'R015',
        value: 'Son in-law'
      },
      {
        key: 'R016',
        value: 'Daughter in-law'
      },
      {
        key: 'R017',
        value: 'Brother in-law'
      },
      {
        key: 'R018',
        value: 'Sister in-law'
      },
      {
        key: 'R019',
        value: 'Nephew'
      },
      {
        key: 'R020',
        value: 'Niece'
      },
      {
        key: 'R021',
        value: 'Partnership'
      },
      {
        key: 'R022',
        value: 'Proprietorship'
      },
      {
        key: 'R023',
        value: 'HUF'
      },
      {
        key: 'R024',
        value: 'Employer-Employee'
      },
      {
        key: 'R025',
        value: 'Uncle'
      },
    ]
  }

  relationshipWithProposer() {
    return [
      {
        key: 'self',
        value: 'Self'
      }, {
        key: 'spouse',
        value: 'Spouse'
      },
      {
        key: 'father',
        value: 'Father'
      },
      {
        key: 'mother',
        value: 'Mother'
      },
      {
        key: 'father-in-law',
        value: 'Father-in-law'
      }, {
        key: 'mother-in-law',
        value: 'Mother-in-law'
      }
    ];
  }



  // getLocation(coords) {
  //   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${environment.GOOGLE_API_KEY}`;
  //   return this._http.get(url).pipe(
  //     catchError(this.handleError) // then handle the error
  //   );
  // }

}