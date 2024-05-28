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
export class ConsultaExternaService {
  urlBase = environment.URL_API;
  //URL_API_aux = this.urlBase+'primer-nivel-consulta-externa-admision';  
  URL_API_aux = this.urlBase+'segundo-nivel-admision';  
  
  URL_API_OFICIAL_CONSULTA_EXTERNA = this.urlBase+'segundo-nivel-revertirFicha';
  

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

  comversor(fecha: any) {
    this.cadena = fecha.toString();
    if (this.cadena.length >= 11) {
      var asignado = fecha;
      var fecselect = new Date(asignado);
      this.mes = fecselect.getMonth() + 1;
      this.dia = fecselect.getDate();
      if (fecselect.getDate() < 10) {
        this.dia = '0' + this.dia;
      }
      if (fecselect.getMonth() < 9) {
        this.mes = '0' + this.mes;
      }
      this.fech_mod = fecselect.getFullYear() + '-' + this.mes + '-' + this.dia;
    } else {
      var asignado = fecha;
      var fecselect = new Date(asignado);
      this.mes = fecselect.getMonth() + 1;
      this.dia = fecselect.getDate();
      if (fecselect.getDate() < 10) {
        this.dia = '0' + this.dia;
      }
      if (fecselect.getMonth() < 9) {
        this.mes = '0' + this.mes;
      }
      this.fech_mod = fecselect.getFullYear() + '-' + this.mes + '-' + (this.dia);
    }
    return this.fech_mod;
  }

  listar_fichas(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_OFICIAL_CONSULTA_EXTERNA+'/fichas_revertir' ,params);
  }

  revertir_ficha(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_OFICIAL_CONSULTA_EXTERNA+'/ficha_revertida' ,params);
  }

  hoja_referencia(body: any){
    const url = this.urlBase+"segundo-nivel-kardex-admision/hoja-referencia";
    return this.http.post(url,body);
  };

  hoja_referencia_actualizacion(body: any){
    const url = this.urlBase+"segundo-nivel-kardex-admision/hoja-referencia-actualizacion";
    return this.http.post(url,body);
  };

  buscar_ficha(body: any){
    const url = this.urlBase+"segundo-nivel-kardex-admision/buscar-ficha";
    return this.http.post(url,body);
  };

  ///////////////////////////////////////ADMISIONES///////////////////////////////////////
  listarEdad(body: any): Observable<any> {
    return this.http.post<any>(this.urlBase+'segundo-nivel-admision/edad',
    body);
  }

  listarIdioma(body: any): Observable<any> {
    return this.http.post<any>(this.urlBase+'segundo-nivel-admision/hospital-catalogo-datos',
    body);
  }

  listarProfesiones(body: any): Observable<any> {
    return this.http.post<any>(this.urlBase+'segundo-nivel-admision/profesiones',
    body);
  }

  listarPaises(body: any): Observable<any> {
    return this.http.post<any>(this.urlBase+'segundo-nivel-admision/paises',
    body);
  }

  listarProvincias(body: any): Observable<any> {
    return this.http.post<any>(this.urlBase+'segundo-nivel-admision/provincias',
    body);
  }

  listarMunicipios(body: any): Observable<any> {
    return this.http.post<any>(this.urlBase+'segundo-nivel-admision/municipios',
    body);
  }

  listarZonas(body: any): Observable<any> {
    return this.http.post<any>(this.urlBase+'segundo-nivel-admision/zonas',
    body);
  }
  
  verificacionHc(body: any): Observable<any> {
    return this.http.post<any>(this.urlBase+'segundo-nivel-admision/historia-clinica-siis',
    body);
  }

  historialClinico(body: any): Observable<any> {
    return this.http.post<any>(this.urlBase+'segundo-nivel-admision/historial-clinico',
    body);
  }
  
  tipoSeguro(body: any): Observable<any> {
    return this.http.post<any>(this.urlBase+'segundo-nivel-admision/seguros',
    body);
  }

  listaFichas(body: any): Observable<any> {
    return this.http.post<any>(this.urlBase+'segundo-nivel-admision/pacientes',
    body);
  }
  
  
  ////////////////////// SICE /////////////////////////
  buscarCodigoSice(body: any): Observable<any> {
    return this.http.post<any>(this.urlBase+'admision/buscarCodigoSice',
    body);
  }

  insertarActualizarSice(body: any): Observable<any> {
    return this.http.post<any>(this.urlBase+'admision/insertar_actualizar',
    body);
  }
  ////////////////////// SICE /////////////////////////
  

  ///////////////////////////////////////ADMISIONES///////////////////////////////////////

  

  
}
