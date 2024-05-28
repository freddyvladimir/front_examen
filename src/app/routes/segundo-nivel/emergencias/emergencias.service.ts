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
export class EmergenciasService {
  urlBase = environment.URL_API;

  URL_API_2 = this.urlBase+'primer-nivel-consulta-externa-admision';

  URL_API = this.urlBase;
 
  URL_API_OFICIAL_EMERGENCIAS_MEDICO = this.urlBase+'segundo-nivel-emergencia-medico';
  URL_API_OFICIAL_EMERGENCIAS_ENFERMERIA = this.urlBase+'segundo-nivel-emergencia-enfermeria';
  URL_API_OFICIAL_EMERGENCIAS_INTERCONSULTA = this.urlBase+'segundo-nivel-emergencia-valoracionEspecialidad';

  URL_API_IFACTURAS = environment.URL_API_FACTURACION;



  //////////fechas/////////
  cadena: any;
  mes: any;
  dia: any;
  fech_mod: any;
  //////////fechas///////// 
  constructor(
    private http: HttpClient) {
  }


  /**  PACIENTES ASIGNADOS  */

  lst_atencion_enfermeria(_cen_id: any, _fecha: any, _id_usu: any): Observable<any>{
    return this.http.post<any>(
      this.URL_API+'segundo-nivel-emergencia-enfermeria/paciente',
      {"hspid":_cen_id,
       "tfecha":_fecha,
       "vid_usr":_id_usu},
      httpOptions);
  }

  lst_cubiculos(hosid: any): Observable<any>{
    return this.http.post<any>(
      this.URL_API+'segundo-nivel-emergencia-enfermeria/cubiculo',
      {"hosid":hosid},
      httpOptions);
  }

  /**  LISTAR TRIAJE */

  lst_triaje(): Observable<any>{
    return this.http.post<any>(
      this.URL_API+'segundo-nivel-emergencia-enfermeria/triaje-tipo',
      {},
      httpOptions);
  }

  dinamico(consulta: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_2+'dinamico',
      consulta);
  }

  buscar(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_OFICIAL_EMERGENCIAS_MEDICO+'/paciente-asignado' ,params);
  }

  asistencia(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_OFICIAL_EMERGENCIAS_MEDICO+'/verifica-asistencia-enfermeria' ,params);
  }

  cubiculo(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_OFICIAL_EMERGENCIAS_ENFERMERIA+'/cubiculo' ,params);
  }

  cie10(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_OFICIAL_EMERGENCIAS_MEDICO+'/cie' ,params);
  }

  derivar_lista_medicos(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_OFICIAL_EMERGENCIAS_MEDICO+'/derivacion-medico' ,params);
  }


  login_ifacturas(params: any): Observable<any>{
    return this.http.post<any>(
      this.URL_API_IFACTURAS+'/apiLogin' ,params);
  }

  listado_items_sierra(params: any, httpOptions: any): Observable<any>{
    return this.http.post<any>(
      this.URL_API_IFACTURAS+'/v.0.0/serv/facturas/catalogo' ,params, httpOptions);
  }


  insertarEnfermeriaEmergencia(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_OFICIAL_EMERGENCIAS_ENFERMERIA +'/insertar',params);
  }

  listarAtencionMedicoEspecialista(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_OFICIAL_EMERGENCIAS_MEDICO +'/listar-atencion-medico-especialista',params);
  }

  listarContrareferenciaEmergencias(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_OFICIAL_EMERGENCIAS_MEDICO +'/listar-contrareferencia-emergencias',params);
  }

  listarPacientesAsignadosMedicoEspecialista(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_OFICIAL_EMERGENCIAS_MEDICO +'/listar-pacientes-asignados-medico-especialista',params);
  }



  listarFechaActual(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API+'segundo-nivel-enfermeria/fecha-actual' ,params);
  }

  listarEspecialidades(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_OFICIAL_EMERGENCIAS_INTERCONSULTA +'/listar_especialidades',params);
  }

  listarMedicos(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_OFICIAL_EMERGENCIAS_INTERCONSULTA +'/listar_medicos',params);
  }

  DerivarEspecialidad(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API_OFICIAL_EMERGENCIAS_INTERCONSULTA +'/derivar_especialidad',params);
  }

  convertir_formato_hora(hora: any) {
    const fec = new Date(hora);
    hora = fec.getHours() + ':' + fec.getMinutes();
    return hora;
  }
}


