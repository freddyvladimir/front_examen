import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    //Authorization: 'my-auth-token'
  }),
};

@Injectable({
  providedIn: 'root',
})
export class HemodialisisService {
  urlBase = environment.URL_API;
  URL_API = this.urlBase;

  constructor(private http: HttpClient) {}
  /**  MAQUINAS  */
  lst_maquinas(_cen_id: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API + 'segundo-nivel-hemodialisis-maquina/lista',
      { _cen_id: _cen_id },
      httpOptions
    );
  }
  lst_parametricas(): Observable<any> {
    return this.http.post<any>(
      this.URL_API + 'segundo-nivel-hemodialisis-maquina/lista-parametros',
      {},
      httpOptions
    );
  }
  lst_abm(params: any): Observable<any> {
    return this.http.post<any>(this.URL_API + 'segundo-nivel-hemodialisis-maquina/abm', params);
  }
  /**  PACIENTES NO ASIGNADOS  */

  lst_noAsignados(_cen_id: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API + 'segundo-nivel-hemodialisis-paciente/no-asignado',
      { _cen_id: _cen_id },
      httpOptions
    );
  }

  /**  PACIENTES ASIGNADOS  */

  lst_asignados(_cen_id: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API + 'segundo-nivel-hemodialisis-paciente/asignado',
      { _cen_id: _cen_id },
      httpOptions
    );
  }
  lst_tipo_vascular(_cen_id: any): Observable<any> {
    return this.http.post<any>(this.URL_API + 'segundo-nivel-hemodialisis-reporte/tipo-vascular', {
      _cen_id: _cen_id,
    });
  }
  // BRAYAN

  lst_abm_noAsignados(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API + 'segundo-nivel-hemodialisis-paciente/no-asignado-abm',
      params
    );
  }
  obtenerDatosPacienteSP(params: any): Observable<any> {
    return this.http.post<any>(
      this.urlBase +
        'segundo-nivel-hemodialisis-atencion-consultorio/hemodialisis-sp-obtener-datos-paciente',
      params
    );
  }
  sp_abm_laboratorio(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API +
        'segundo-nivel-hemodialisis-atencion-consultorio/hemodialisis-sp-abm-plaboratorio',
      params
    );
  }
  sp_listar_imprlabos(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API +
        'segundo-nivel-hemodialisis-atencion-consultorio/hemodialisis-sp-listar-imprlabos',
      params
    );
  }

  dinamico(consulta: any): Observable<any> {
    return this.http.post<any>(this.URL_API + 'dinamico', consulta, httpOptions);
  }

  buscar(params: any): Observable<any> {
    return this.http.post<any>(
      this.urlBase + 'segundo-nivel-hemodialisis-enfermeria/buscar',
      params
    );
  }

  getHojaDatos(params: any): Observable<any> {
    return this.http.post<any>(
      this.urlBase + 'segundo-nivel-hemodialisis-enfermeria/hoja-datos',
      params
    );
  }

  updateHemoEnfermeria(params: any): Observable<any> {
    return this.http.post<any>(
      this.urlBase + 'segundo-nivel-hemodialisis-enfermeria/paciente-hoja',
      params
    );
  }

  getAlergias(params: any): Observable<any> {
    return this.http.post<any>(
      this.urlBase + 'segundo-nivel-hemodialisis-enfermeria/hoja-datos',
      params
    );
  }
  getAlergias2(params: any): Observable<any> {
    return this.http.post<any>(
      this.urlBase + 'segundo-nivel-hemodialisis-consultorio/alergia',
      params
    );
  }

  obtenerHojaDatos(params: any): Observable<any> {
    return this.http.post<any>(
      this.urlBase + 'segundo-nivel-hemodialisis-enfermeria/hoja-datos',
      params
    );
  }
  obtenerHojaDatosConsultorio(params: any): Observable<any> {
    return this.http.post<any>(
      this.urlBase + 'segundo-nivel-hemodialisis-consultorio/hoja-datos-consultorio',
      params
    );
  }
  getProcedimiento(params: any): Observable<any> {
    return this.http.post<any>(
      this.urlBase + 'segundo-nivel-hemodialisis-consultorio/procedimiento',
      params
    );
  }
  sp_abm_PacienteHoja(params: any): Observable<any> {
    return this.http.post<any>(
      this.urlBase +
        'segundo-nivel-hemodialisis-pasientes-asignados/hemodialisis-sp-abm-pacientehoja',
      params
    );
  }

  getMedicamentos(params: any): Observable<any> {
    return this.http.post<any>(
      this.urlBase + 'segundo-nivel-hemodialisis-consultorio/medicamento',
      params
    );
  }

  /* YEISON */
  lstParametricas(): Observable<any> {
    return this.http.post<any>(
      this.URL_API + 'segundo-nivel-hemodialisis-admision/hemodialisis-sp-listar-parametros',
      {},
      httpOptions
    );
  }

  abmPacientes(): Observable<any> {
    return this.http.post<any>(
      this.URL_API + 'segundo-nivel-hemodialisis-admision/hemodialisis-sp-abm-pacientes',
      {},
      httpOptions
    );
  }

  /**  ENFERMERIA  */

  listarAtenciones(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API + 'segundo-nivel-hemodialisis-enfermeria/lista',
      params
    );
  }

  hojaHemodialisis(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API + 'segundo-nivel-hemodialisis-enfermeria/paciente-hoja',
      params
    );
  }
  listaCentrosHospitalarios(): Observable<any> {
    return this.http.post<any>(
      this.URL_API + 'segundo-nivel-hemodialisis-maquina/lista-centros',
      {},
      httpOptions
    );
  }

  /* CONSULTORIO YEISON * */
  getDatosPaciente(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API + 'segundo-nivel-hemodialisis-consultorio/paciente-datos', params);
  }

  guardarMedicamento(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API + 'segundo-nivel-hemodialisis-consultorio/medicamento-abm', params);
  }

  lstImpriMedicamento(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API + 'segundo-nivel-hemodialisis-atencion-consultorio/hemodialisis-sp-listar-imprmedi', params);
  }

  lstImpriLaboratorio(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API + 'segundo-nivel-hemodialisis-atencion-consultorio/hemodialisis-sp-listar-imprlabos', params);
  }


  abmLaboratorio(params: any): Observable<any> {
    return this.http.post<any>(
      this.URL_API + 'segundo-nivel-hemodialisis-atencion-consultorio/hemodialisis-sp-abm-plaboratorio', params);
  }

}
