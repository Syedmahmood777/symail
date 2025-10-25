import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User} from '../db_models/user_login';
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
