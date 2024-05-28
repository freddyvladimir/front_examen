import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { AuthService } from '@core/authentication';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isSubmitting = false;
  hide = true;
  response: any;
  dataMenu: any = [];
  datos: any;
  fechaServer: any;
  loginForm = this.fb.group({
    username: [''],
    password: ['']
  });
  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService
    , private toast: ToastrService) { }

  ngOnInit() { }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe');
  }
  cncelar() {

  }
  loginAdministracion() {
    /*this.auth.fechaServidor()
      .subscribe(response => {
        this.fechaServer = response.detalle.fecha;
      });*/
    this.isSubmitting = true;
    let data = {
      /*"usuario": this.username?.value,
      "clave": this.password?.value,
      "sistema": "SIIS"*/
      //"sistema": "SIIS_INDICADORES"
      "nombre": "ejemplo",
      "contraseña": "ejemplo"
    };
    this.auth.loginAdministracion(this.username?.value, this.password?.value, data)
      .subscribe(response => {
        this.response = response;
        console.log("------>",this.response);
        
        if (response.status === 300) {
          this.toast.error(this.response.datos, '', {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
            newestOnTop: false,
            extendedTimeOut: 0,
            tapToDismiss: false
          });
          this.isSubmitting = false;
        }
        if (response.status === 200) {

          this.auth.setDataStorage(this.response.datos);
          this.auth.storageToken(this.response.token);
          this.auth.setGenericSession("ID_HOSPITAL", 10);
          //this.auth.setGenericSession("usuario", this.response.data[0].usuario);

          /* -------------------------------------DATOS DE USUARIO --------------------------*/
          //this.auth.setGenericSession("ID_HOSPITAL", this.response.data[0].SIIS_hsp_id);
          /*this.auth.setGenericSession("NOMBRE_HOSPITAL", this.response.data[0].SIIS_hsp_nombre_hospital);
          this.auth.setGenericSession("IDUSUARIO", this.response.data[0].id_usuario);
          this.auth.setGenericSession("CODIGO_HOSPITAL", this.response.data[0].SIIS_hsp_codigo_hospital);
          this.auth.setGenericSession("usuario", this.response.data[0].usuario);*/
          /*---------------------------------------------------------------------------------*/

          /*this.auth.setGenericSession("codigo", this.response.contribuyente);
          this.auth.setGenericSession("usuario", this.response.data[0].id_usuario);
          this.auth.setGenericSession("rol", this.response.data[0].sistemas[0].roles[0].nombre_rol);
          this.auth.setGenericSession("sucursal", 0);
          this.auth.setGenericSession("id_sucursal", 0);
          this.auth.setGenericSession("puntodeventa", 0);
          let date = this.fechaServer;
          let dateArray = date.split('-');
          this.auth.setGenericSession("fechaserver", this.fechaServer);
          this.auth.setGenericSession("gestion", dateArray[0]);
          this.auth.setGenericSession("roles", JSON.stringify(this.response.data[0].sistemas[0].roles));
          this.auth.setGenericSession("menus", JSON.stringify(this.response.data[0].sistemas[0].menus));          
          this.auth.setGenericSession("unidadRecaudadora", 1);
          this.auth.setGenericSession("usuario_desc", this.response.data[0].usuario);*/
          //storageToken
          // this.dataMenu = this.response.accesos[0].sp_usuario_acceso_json[0].sistemas[0].menus;
          var user = [
            { "usuario": "centromonitoreo.prueba", "clave": "Hospitales123", "sistema": "SIIS" },
            { "usuario": "lamerced.prueba", "clave": "Hospitales123", "sistema": "SIIS" },
            { "usuario": "cotahuma.prueba", "clave": "Hospitales123", "sistema": "SIIS" },
            { "usuario": "laportada.prueba", "clave": "Hospitales123", "sistema": "SIIS" },
            { "usuario": "lospinos.prueba", "clave": "Hospitales123", "sistema": "SIIS" }
          ];
          this.dataMenu = [
            {
              "route": "dashboard",
              "name": "dashboard",
              "type": "link",
              "icon": "dashboard",
              "badge": {
                "color": "red-500",
                "value": "5"
              }
            },
            {
              "route": "peliculas",
              "name": "Peliculas",
              "type": "sub",
              "icon": "subscriptions",
              "children": [
                {
                  "route": "creacion-peliculas",
                  "name": "Creacion peliculas",
                  "type": "link"
                }
              ]
            },
            {
              "route": "reportes",
              "name": "Reportes",
              "type": "sub",
              "icon": "unarchive",
              "children": [
                {
                  "route": "reporte-peliculas",
                  "name": "Reporte peliculas",
                  "type": "link"
                }
              ]
            }
            
            
            /*,
            {
              "route": "parametricas",
              "name": "parametricas",
              "type": "sub",
              "icon": "brightness_7",
              "children": [
                {
                  "route": "programacion-fichas",
                  "name": "programacion-fichas",
                  "type": "link"
                },
                {
                  "route": "especialidades",
                  "name": "especialidades",
                  "type": "link"
                },
                {
                  "route": "consultorios",
                  "name": "consultorios",
                  "type": "link"
                },
                {
                  "route": "medico-especialidad",
                  "name": "medico-especialidad",
                  "type": "link"
                }
              ]
            },
            {
              "route": "primer-nivel",
              "name": "primer-nivel",
              "type": "sub",
              "icon": "assignment",
              "children": [
                {
                  "route": "admisiones",
                  "name": "admisiones",
                  "type": "link"
                },
                {
                  "route": "cajas",
                  "name": "cajas",
                  "type": "link"
                },
                {
                  "route": "enfermeria",
                  "name": "enfermeria",
                  "type": "link"
                },
                {
                  "route": "consultorio",
                  "name": "consultorio",
                  "type": "link"
                }
              ]
            },
            {
              "route": "segundo-nivel",
              "name": "segundo-nivel",
              "type": "sub",
              "icon": "assignment",
              "children": [
                {
                  "route": "admisiones",
                  "name": "admisiones",
                  "type": "link"
                },
                {
                  "route": "cajas",
                  "name": "cajas",
                  "type": "link"
                },
                {
                  "route": "kardex",
                  "name": "kardex",
                  "type": "link"
                },
                {
                  "route": "enfermeria",
                  "name": "enfermeria",
                  "type": "link"
                },
                {
                  "route": "consultorio",
                  "name": "consultorio",
                  "type": "link"
                },
                {
                  "route": "revertirFicha",
                  "name": "revertirFicha",
                  "type": "link"
                },
                {
                  "route": "hojaReferencia",
                  "name": "hojaReferencia",
                  "type": "link"
                },
                {
                  "route": "buscarFicha",
                  "name": "buscarFicha",
                  "type": "link"
                }
              ]
            },
            {
              "route": "hemodialisis",
              "name": "hemodialisis",
              "type": "sub",
              "icon": "assignment",
              "children": [
                {
                  "route": "enfermeria",
                  "name": "enfermeria",
                  "type": "link"
                }
                ,
                {
                  "route": "consultorio",
                  "name": "consultorio",
                  "type": "link"
                },
                {
                  "route": "maquinas",
                  "name": "maquinas",
                  "type": "link"
                },
                {
                  "route": "pacientesNoAsignados",
                  "name": "pacientesNoAsignados",
                  "type": "link"
                },
                {
                  "route": "pacientesAsignados",
                  "name": "pacientesAsignados",
                  "type": "link"
                }
              ]
            },
            {
              "route": "emergencias",
              "name": "emergencias",
              "type": "sub",
              "icon": "assignment",
              "children": [
                {
                  "route": "enfermeria",
                  "name": "enfermeria",
                  "type": "link"
                },
                {
                  "route": "consultorio",
                  "name": "consultorio",
                  "type": "link"
                },
                {
                  "route": "medico",
                  "name": "medico",
                  "type": "link"
                },
                {
                  "route": "medico-especialista",
                  "name": "medico-especialista",
                  "type": "link"
                },
                {
                  "route": "reporte-medico",
                  "name": "reporte-medico",
                  "type": "link"
                }
              ]
            },
            {
              "route": "servicios-complementarios",
              "name": "servicios-complementarios",
              "type": "sub",
              "icon": "assignment",
              "children": [
                {
                  "route": "administracion",
                  "name": "administracion",
                  "type": "link"
                },
                {
                  "route": "reporte-eco",
                  "name": "Reporte diario ecografia",
                  "type": "link"
                },
                {
                  "route": "reporte-radio",
                  "name": "Reporte diario radiologia",
                  "type": "link"
                }
              ]
            },
            {
              "route": "admisiones",
              "name": "admisiones",
              "type": "sub",
              "icon": "assignment",
              "children": [
                {
                  "route": "duplicados",
                  "name": "duplicados",
                  "type": "link"
                },
                {
                  "route": "reprogramacion",
                  "name": "reprogramacion",
                  "type": "link"
                }
              ]
            },
            {
              "route": "centro-monitoreo",
              "name": "Centro de monitoreo",
              "type": "sub",
              "icon": "departure_board",
              "children": [
                {
                  "route": "atencion",
                  "name": "Atención",
                  "type": "link"
                },
                {
                  "route": "monitoreo",
                  "name": "Monitoreo",
                  "type": "link"
                },
                {
                  "route": "pantalla",
                  "name": "Pantalla",
                  "type": "link"
                },
                {
                  "route": "abmcie10",
                  "name": "CIE 10",
                  "type": "link"
                },
                {
                  "route": "reportegenerar",
                  "name": "Reporte generar",
                  "type": "link"
                },
                {
                  "route": "registropacientes",
                  "name": "Registro de pacientes",
                  "type": "link"
                }
              ]
            },
            {
              "route": "indicadores",
              "name": "Indicadores",
              "type": "sub",
              "icon": "insert_chart_outlined",
              "children": [
                {
                  "route": "semaforo",
                  "name": "Semaforo",
                  "type": "link"
                },
                {
                  "route": "rendimiento",
                  "name": "Rendimiento",
                  "type": "link"
                },
                {
                  "route": "tendencia",
                  "name": "Tendencia",
                  "type": "link"
                }
              ]
            },
            {
              "route": "reportes-gamlp",
              "name": "Reportes GAMLP",
              "type": "sub",
              "icon": "insert_chart",
              "children": [
                {
                  "route": "por-hospital",
                  "name": "Por Hospital",
                  "type": "link"
                },
                {
                  "route": "servicio-emergencias",
                  "name": "Reporte Servicio Emergencias",
                  "type": "link"
                }
              ]
            },
            {
              "route": "fichas",
              "name": "Fichas",
              "type": "sub",
              "icon": "devices",
              "children": [
                {
                  "route": "dispensador",
                  "name": "Dispensador",
                  "type": "link"
                },
                {
                  "route": "monitor",
                  "name": "Monitor",
                  "type": "link"
                },
                {
                  "route": "administracion",
                  "name": "Administración",
                  "type": "link"
                }

              ]
            }*/
          ];

          this.auth.setMenuStorage(this.dataMenu);
          this.router.navigateByUrl('/');
          this.toast.success('Bienvenido !', '', {
            timeOut: 3000,
            progressBar: true,
            closeButton: true,
            extendedTimeOut: 0,
            tapToDismiss: false,
            //positionClass: "toast-bottom-right",
          });
          this.isSubmitting = false;
        }
      });
  }

  login() {
    this.isSubmitting = true;

    this.auth
      .login(this.username?.value, this.password?.value, this.rememberMe?.value)
      .pipe(filter(authenticated => authenticated))
      .subscribe(
        () => this.router.navigateByUrl('/'),
        (errorRes: HttpErrorResponse) => {
          if (errorRes.status === 422) {
            const form = this.loginForm;
            const errors = errorRes.error.errors;
            Object.keys(errors).forEach(key => {
              form.get(key === 'email' ? 'username' : key)?.setErrors({
                remote: errors[key][0],
              });
            });
          }
          this.isSubmitting = false;
        }
      );
  }
}
