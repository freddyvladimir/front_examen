import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
const token = "Bearer "+sessionStorage.getItem('token');
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Authorization": token
  })
};

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {
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

  listaPeliculas(): Observable<any> {
    return this.http.get<any>(
      this.urlBase+'peliculas/listaPeliculas',httpOptions);
  }

  deletepeliculas(id: any): Observable<any> {
    return this.http.delete<any>(this.urlBase + 'peliculas/eliminarPelicula/'+ id, httpOptions);
  }

  crearDatos(data: any): Observable<any> {
    return this.http.post<any>(
      this.urlBase+'peliculas/crearPeliculas', data,httpOptions);
  }

  actualizarDatos(data: any): Observable<any> {
    return this.http.put<any>(
      this.urlBase+'peliculas/modificarPelicula/'+data._id, data,httpOptions);
  }

  reportesPeliculas(): Observable<any> {
    return this.http.get<any>(
      this.urlBase+'peliculas/listarPeliculasCalificaciones',httpOptions);
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

 
  
}
