import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: 'my-auth-token'
  })
};


@Injectable({
  providedIn: 'root'
})
export class ComponentesService {
  urlBase = environment.URL_API;
  urlSice = environment.URL_API_COTAHUMA;
  url_api_consulta_externa_admision = this.urlBase+'primer-nivel-consulta-externa-admision';
  //////////fechas/////////
  cadena: any;
  mes: any;
  dia: any;
  fech_mod: any;
  //////////fechas///////// 
  constructor(
    private http: HttpClient) {
  }

  datos_paciente(params: any): Observable<any> {
    return this.http.post<any>(
      this.url_api_consulta_externa_admision + '/datos-paciente', params);
  }

  lista_especialidades(params: any): Observable<any> {
    return this.http.post<any>(
      this.url_api_consulta_externa_admision + '/especialidad', params);
  }

  lista_calendario(params: any): Observable<any> {
    return this.http.post<any>(
      this.url_api_consulta_externa_admision + '/dias-programados', params);
  }

  lista_fichas(params: any): Observable<any> {
    return this.http.post<any>(
      this.url_api_consulta_externa_admision + '/cronograma-prestacion', params);
  }

  comversor(fecha: any) {
    this.cadena = fecha.toString();
    if (this.cadena.length >= 11) {
      var asignado = fecha;
      var fecselect = new Date(asignado);
      this.mes = fecselect.getMonth() + 1;
      this.dia = fecselect.getDate()
      if (fecselect.getDate() < 10) {
        this.dia = "0" + this.dia;
      }
      if (fecselect.getMonth() < 9) {
        this.mes = "0" + this.mes;
      }
      this.fech_mod = fecselect.getFullYear() + "-" + this.mes + "-" + this.dia;
    } else {
      var asignado = fecha;
      var fecselect = new Date(asignado);
      this.mes = fecselect.getMonth() + 1;
      this.dia = fecselect.getDate();
      if (fecselect.getDate() < 10) {
        this.dia = "0" + this.dia;
      }
      if (fecselect.getMonth() < 9) {
        this.mes = "0" + this.mes;
      }
      this.fech_mod = fecselect.getFullYear() + "-" + this.mes + "-" + (this.dia);
    }
    return this.fech_mod;
  }


  buscarPacienteReprogramacionNuevo(params: any): Observable<any> {
    return this.http.post<any>(
      this.urlBase + 'segundo-nivel-regularizacion-reprogramacion/buscar-paciente-reprogramacion-nuevo', params);
  }

  ////////////////////// SICE /////////////////////////
  buscarCodigoSice(body: any): Observable<any> {
    return this.http.post<any>(this.urlSice+'admision/buscarCodigoSice',
    body);
  }
  buscarSice(body: any): Observable<any> {
    return this.http.post<any>(this.urlSice+'admision/buscarSice',
    body);
  }
  
  ////////////////////// SICE /////////////////////////
  
}
