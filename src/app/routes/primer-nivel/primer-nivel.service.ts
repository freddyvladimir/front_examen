import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"

    //Authorization: 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PrimerNivelService {
  urlBase = environment.URL_API;
    
  URL_API_aux = this.urlBase+'primer-nivel-consulta-externa-admision';

  centros: string = environment.centros;
  zonas: string = environment.zonas;

  URL_API_OFICIAL = this.urlBase;
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
      consulta,httpOptions);
  }
  addHero(hero: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_aux+'/buscarPaciente',
      hero,
      httpOptions);
  }

  getCentros(): any {
    return this.http.get(this.centros);
  }
  getZonas(): any {
    return this.http.get(this.zonas);
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

  servicioSus(consulta: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_OFICIAL+'/sus/ministerio-salud',
      consulta);
  }

  redSalud(body: any){
    let header = new HttpHeaders()
    .set('Type-content', 'aplication/json')
    return this.http.post(this.URL_API_OFICIAL+'/mapa/redsalud' ,body,{
      headers: header
    });
  };


  login(body: any){
    let header = new HttpHeaders()
    .set('Type-content', 'aplication/json')
    return this.http.post(this.URL_API_OFICIAL+'/hospital/autenticacion-administracion' ,body,{
      headers: header
    });
  };
  
}
