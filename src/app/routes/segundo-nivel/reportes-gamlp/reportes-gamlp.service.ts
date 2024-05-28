import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportesGamlpService {

  urlBase = environment.URL_API;
  url_api_reportes_gamlp = this.urlBase + 'segundo-nivel-reportes';
  
  constructor(
    private http: HttpClient) {
  }

  getPorHospital(params: any): Observable<any> {
    return this.http.post<any>(
      this.url_api_reportes_gamlp+ '/reporte-hospital-1', params);
  }
  getEspecialidades(params: any): Observable<any> {
    return this.http.post<any>(
      this.url_api_reportes_gamlp+ '/reporte-especialidades-generales', params);
  }

  getReservas(params: any): Observable<any> {
    return this.http.post<any>(
      this.url_api_reportes_gamlp+ '/lst-reservas', params);
  }

  
  getReservasPorMeses(params: any): Observable<any> {
    return this.http.post<any>(
      this.url_api_reportes_gamlp+ '/lst-pacientes-internet', params);
  }

  getReportePrestacion1(params: any): Observable<any> {
    return this.http.post<any>(
      this.url_api_reportes_gamlp+ '/reporte-prestacion-1', params);
  }  
  getReporteDoctorPrestacion1(params: any): Observable<any> {
    return this.http.post<any>(
      this.url_api_reportes_gamlp+ '/reporte-doctor-prestacion-1', params);
  } 

  getLstReporteServicioEmergencias(params: any): Observable<any> {
    return this.http.post<any>(
      this.url_api_reportes_gamlp+ '/lst-reporte-servicio-emergencias', params);
  } 
  
}
