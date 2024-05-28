import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*',
    //Authorization: 'my-auth-token'
  })
};
@Injectable({
  providedIn: 'root'
})
export class ParametricasService {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  urlBase = environment.URL_API;
  URL_API = this.urlBase+'primer-nivel-consulta-externa-admision';
  _url = this.urlBase+"especialidad";
  _url_consultorio = this.urlBase+"consultorio";
  
  _url_correlativo = this.urlBase+"correlativo";
  URL_API_aux = this.urlBase+'primer-nivel-consulta-externa-admision';

  constructor(
    private http: HttpClient) {
  }

  dinamico(consulta: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API+'/dinamico',
      consulta,httpOptions);
  }

  
  addHero(hero: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_aux+'/buscarPaciente',
      hero,
      httpOptions);
  }
  postCorrelativo(){
    let header = new HttpHeaders()
    .set('Type-content', 'aplication/json')
    return this.http.post(this._url_correlativo,{
      headers: header
    });
  };

  postLstHspPrestaciones(body: any){
    var url = this.urlBase+"especialidad/lstHspPrestaciones";
    let header = new HttpHeaders()
    .set('Type-content', 'aplication/json')
    return this.http.post(url,body,{
      headers: header
    });
  };

  getEspecialidad(){
    const url = this._url+'/lstSrvEspecialidad';
    let header = new HttpHeaders()
    .set('Type-content', 'aplication/json')
    return this.http.post(url,{"id":this.CODIGO_HOSPITAL},{
      headers: header
    });
  };

  postEspecialidad(body: any){
    let header = new HttpHeaders()
    .set('Type-content', 'aplication/json')
    return this.http.post(this._url,body,{
      headers: header
    });
  };

  putEspecialidad(body: any){
    var url = this.urlBase+"especialidad/" + body.esp_id;
    let header = new HttpHeaders()
    .set('Type-content', 'aplication/json')
    return this.http.patch(url,body,{
      headers: header
    });
  };

  deleteEspecialidad(id: any){
    var url = this.urlBase+"especialidad/" + id;
    let header = new HttpHeaders()
    .set('Type-content', 'aplication/json')
    return this.http.delete(url,{
      headers: header
    });
  };
   
  getConsultorio(){
    const url = this._url_consultorio+'/consultorioprocedimiento';
    let header = new HttpHeaders()
    .set('Type-content', 'aplication/json')
    return this.http.post(url,{"idhsp":this.CODIGO_HOSPITAL},{
      headers: header
    });
  };

  postConsultorio(body: any){
    let header = new HttpHeaders()
    .set('Type-content', 'aplication/json')
    return this.http.post(this._url_consultorio,body,{
      headers: header
    });
  };

  putConsultorio(body: any){
    var url = this._url_consultorio+'/'+body.cnsl_id;
    let header = new HttpHeaders()
    .set('Type-content', 'aplication/json')
    return this.http.patch(url,body,{
      headers: header
    });
  };

  deleteConsultorio(id: any){
    var url = this._url_consultorio+'/'+id;
    let header = new HttpHeaders()
    .set('Type-content', 'aplication/json')
    return this.http.delete(url,{
      headers: header
    });
  };

  comvertir_formato_hora(hora: any) {
    var fec = new Date(hora);
    hora = fec.getHours() + ':' + fec.getMinutes();
    return hora;
  }
  
}
