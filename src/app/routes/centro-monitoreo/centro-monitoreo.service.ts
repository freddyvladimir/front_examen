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
export class CentroMonitoreoService {
  urlBase = environment.URL_API;
  
  URL_API_aux = this.urlBase+'segundo-nivel-admision';  
  URL_CENTRO_MONITOREO = this.urlBase + 'segundo-nivel-centro-monitoreo';
  URL_CENTRO_MONITOREO_ATENCION = this.urlBase + 'segundo-nivel-centro-monitoreo-atencion';
  URL_CENTRO_MONITOREO_CIE10 = this.urlBase + 'segundo-nivel-centro-monitoreo-cie10';
  URL_CENTRO_MONITOREO_REPORTE = this.urlBase + 'segundo-nivel-centro-monitoreo-reportecentro';
  
  

  //////////fechas/////////
  cadena: any;
  mes: any;
  dia: any;
  fech_mod: any;
  //////////fechas///////// 
  constructor(
    private http: HttpClient) {
  }

  dinamico(consulta: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_aux+'/dinamico',
      consulta);
  }

  listaFechaActual(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_CENTRO_MONITOREO + '/fecha-hora-actual', params);
  }

  listaCie10(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_CENTRO_MONITOREO + '/lista-cie-10', params);
  }

  listaHospitalesExternos(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_CENTRO_MONITOREO + '/lista-hospitales-externos', params);
  }

  listaTriaje(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_CENTRO_MONITOREO + '/lista-triaje-emergencias', params);
  }

  listaRegulador(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_CENTRO_MONITOREO + '/lista-regulador-monitoreo', params);
  }

  listaConductor(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_CENTRO_MONITOREO + '/lista-conductor-ambulancia', params);
  }

  listaParamedico(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_CENTRO_MONITOREO + '/lista-regulador-monitoreo', params);
  }

  insertarRegistro(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_CENTRO_MONITOREO + '/insertar-atencion-monitoreo', params);
  }

  comvertir_formato_hora(hora: any) {
    var fec = new Date(hora);
    hora = fec.getHours() + ':' + fec.getMinutes();
    return hora;
  }

  listaEspecialidadesCama(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_CENTRO_MONITOREO + '/lista-especialidades-cama', params);
  }

  listaEspecialidadesTotal(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_CENTRO_MONITOREO + '/lista-especialidades-total', params);
  }

  listaCubiculos(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_CENTRO_MONITOREO + '/lista-cubiculos', params);
  }

  listaReporteMonitoreo(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_CENTRO_MONITOREO + '/lista-reporte-hospital-monitoreo', params);
  }

  listaEspecialidadesMedico(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_CENTRO_MONITOREO + '/lista-especialidades-medicos', params);
  }

  listaHospitales(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_CENTRO_MONITOREO + '/lista-hospitales', params);
  }

  listaAtenciones(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_CENTRO_MONITOREO + '/lista-atenciones-centro-monitoreo', params);
  }



  /*  ATENCION  */
  actualizarrRegistro(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_CENTRO_MONITOREO_ATENCION + '/actualizar-atencion-monitoreo', params);
  }

  finalizarRegistro(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_CENTRO_MONITOREO_ATENCION + '/finalizar-atencion-monitoreo', params);
  }




  /*  CIE 10 */
  insertarCie10(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_CENTRO_MONITOREO_CIE10 + '/sp-abm-cie10-monitoreo', params);
  }

  editarCie10(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_CENTRO_MONITOREO_CIE10 + '/edit-sp-abm-cie10-monitoreo', params);
  }

  eliminarCie10(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_CENTRO_MONITOREO_CIE10 + '/elim-sp-abm-cie10-monitoreo', params);
  }

  
  
  /* REPORTE */
  listaReporte(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_CENTRO_MONITOREO_REPORTE + '/reporte-atencion-centro-monitoreo', params);
  }

}
