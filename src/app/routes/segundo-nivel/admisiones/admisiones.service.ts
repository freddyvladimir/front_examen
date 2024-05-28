import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';


@Injectable({
  providedIn: 'root'
})
export class AdmisionesService {
  urlBase = environment.URL_API;
  constructor(private http: HttpClient) {

  }

  URL_API_OFICIAL_ADMISIONES = this.urlBase+'segundo-nivel-regularizacion';
  URL_API = this.urlBase+'admisionPrimerNivel/';
  dinamico(consulta: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API + 'dinamico',
      consulta);
  }

  getDuplicados(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_OFICIAL_ADMISIONES + '/listar-duplicados', params);
  }
  alta(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_OFICIAL_ADMISIONES + '/duplicados-alta', params);
  }
  baja(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_OFICIAL_ADMISIONES + '/duplicados-baja', params);
  } 

}
