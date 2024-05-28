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
export class ServiciosComplementariosService {
  urlBase = environment.URL_API;
  url_api_servicios_complemtarios_administracion = this.urlBase+'segundo-nivel-servicios-complementarios-administracion';
  url_api_reportes = this.urlBase+'segundo-nivel-servicios-complementarios-reportes';
  
  constructor(
    private http: HttpClient) {
  }

  lista_servicios_complementarios(params: any): Observable<any> {
    return this.http.post<any>(
      this.url_api_servicios_complemtarios_administracion+'/lista-servicios-complementarios' ,params);
  }
  

  lista_servicios_complementarios_medicos(params: any): Observable<any> {
    return this.http.post<any>(
      this.url_api_servicios_complemtarios_administracion+'/lista-servicios-complementarios-medicos' ,params);
  }

  lista_servicios_complementarios_combo(params: any): Observable<any> {
    return this.http.post<any>(
      this.url_api_servicios_complemtarios_administracion+'/lista-servicios-complementarios-combo' ,params);
  }

  lista_servicios_complementarios_abm(params: any): Observable<any> {
    return this.http.post<any>(
      this.url_api_servicios_complemtarios_administracion+'/lista-servicios-complementarios-abm' ,params);
  }

  lista_servicios_complementarios_medico_combo(params: any): Observable<any> {
    return this.http.post<any>(
      this.url_api_servicios_complemtarios_administracion+'/lista-servicios-complementarios-medicos-combo' ,params);
  }

  lista_servicios_complementarios_medico_combo_medicos(params: any): Observable<any> {
    return this.http.post<any>(
      this.url_api_servicios_complemtarios_administracion+'/lista-servicios-complementarios-medicos-combo-medicos' ,params);
  }

  lista_servicios_complementarios_medico_combo_abm(params: any): Observable<any> {
    return this.http.post<any>(
      this.url_api_servicios_complemtarios_administracion+'/lista-servicios-complementarios-medicos-abm' ,params);
  }

  lista_servicios_reporte_diario_ecografia(params: any): Observable<any> {
    return this.http.post<any>(
      this.url_api_reportes+'/lista-service-reporte-diario-ecografia' ,params);
  }

  reporte_entrega_resultados_ecografia(params: any): Observable<any> {
    return this.http.post<any>(
      this.url_api_reportes+'/reporte-entrega-resultados-ecografia' ,params);
  }
  
  lista_service_reporte_diario_radiologia(params: any): Observable<any> {
    return this.http.post<any>(
      this.url_api_reportes+'/service-reporte-diario-radiologia' ,params);
  }

}
