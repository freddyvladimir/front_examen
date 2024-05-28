import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    Authorization: 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class IndicadoresService {
  urlBase = environment.URL_API;
  
  URL_API_aux = this.urlBase+'segundo-nivel-admision';  

  constructor(
    private http: HttpClient) {
  }

  dinamico(consulta: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_aux+'/dinamico',
      consulta);
  }
}