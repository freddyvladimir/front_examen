import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token, User } from './interface';
import { Menu } from '@core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  //URL_API = environment.URL_API_LOGIN;
  URL_API = environment.URL_API;

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });

  requestOptions = { headers: this.headers };

  constructor(protected http: HttpClient) {}

  loginAdministracion(body: any): Observable<any> {
    return this.http.post<Token>(this.URL_API+'autenticacion/login', body, this.requestOptions);
    //return this.http.post<Token>(this.URL_API+'hospital/autenticacion-administracion', body, this.requestOptions);
  }





  


  login(username: string, password: string, rememberMe = false) {
    return this.http.post<Token>('/auth/login', { username, password, rememberMe });
  }

  refresh(params: Record<string, any>) {
    return this.http.post<Token>('/auth/refresh', params);
  }

  logout() {
    return this.http.post<any>('/auth/logout', {});
  }

  /*me() {
    return this.http.get<User>('/me');
  }*/

  menu() {
    return this.http.get<{ menu: Menu[] }>('/me/menu').pipe(map(res => res.menu));
  }
}
