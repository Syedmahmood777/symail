import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {response} from '../db_models/response';
import * as moment from 'moment';
import { tap, shareReplay, map } from 'rxjs/operators';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  cred$?:Observable<response>;
  constructor(private http: HttpClient) {}
  login(email: string, password: string) {

    if(!this.cred$){
      this.cred$=this.http.post<response>('http://127.0.0.1:8000/auth/login/', { email, password }).pipe(shareReplay({bufferSize:1,refCount:true}))
    }

    return this.cred$;
  }
signup(fname:string,lname:string,country:string,city:string,phone:number,pin:string,address:string, email: string, password: string,dob:string) {
      return this.http.post<response>('http://127.0.0.1:8000/auth/signup/', {fname,lname,country,city,phone,pin,address, email, password,dob })
    }
signVal(email:string){

  return this.http.get<{exists:boolean}>('http://127.0.0.1:8000/auth/valid/',{
    params:{email}

  });

}

  // private setSession(authResult) {
  //   const expiresAt = moment().add(authResult.expiresIn, 'second');
  //   localStorage.setItem('id_token', authResult.idToken);
  //   localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
  // }
  // logout() {
  //   localStorage.removeItem('id_token');
  //   localStorage.removeItem('expires_at');
  // }
  // public isLoggedIn() {
  //   return moment().isBefore(this.getExpiration());
  // }
  // isLoggedOut() {
  //   return !this.isLoggedIn();
  // }
  // getExpiration() {
  //   const expiration = localStorage.getItem('expires_at');
  //   const expiresAt = JSON.parse(expiration);
  //   return moment(expiresAt);
  // }
}
