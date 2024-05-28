import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
//import { DateRange, MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER } from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { MatStepper } from '@angular/material/stepper';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmergenciasService } from '../../../emergencias.service';
import { CONNREFUSED } from 'dns';


export interface DialogData {
  campos: any;
}

export interface fichasDisponibles {
}


export interface estudiosSeleccionados {
}




@Component({
  selector: 'app-dialog-reserva-fichas',
  templateUrl: './dialog-reserva-fichas.component.html',
  styleUrls: ['./dialog-reserva-fichas.component.scss']
  //providers: [MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER]
})
export class DialogReservaFichasComponent implements OnInit {

  ////// variables  ////////////
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  IDUSUARIO = 1050;
  IDESPECIALIDAD = 185;
  SIIS = 18279;
  SICE = 1;

  datosReserva: any;
  dataServicio: any;
  habServicio = false;
  habEstudios = false;
  habServicioEco = false;
  habEstudioInst = false;
  habEstudioLey = false;
  habEstudioSoat = false;
  habResrvFich = false;
  habListFichas = false;
  idServicio: any;
  descServicio: any;
  idTurno: any;

  token_facturas: any;
  servicioSeleccionado = '';
  unbounded = false;

  displayedColumns: string[] = [
    'opciones', 
    'descripcion', 
    'precio', 
    'especificaciones'];


  displayedColumns1: string[] = [
    'opciones', 
    'descripcion',
    'tiempo',
    'preparacion', 
    'precio', 
    'especificaciones']; 
    
    
  displayedColumnsRyx: string[] = [
    'seleccionar',
    'tecnico',
    'turno',
    'horarioAtencion',
    'fichaExtra'];


  //////////servicios/////////
    sql: any;
    responde: any;

  //////////servicios///////// 
  
  ////////////  Datos  ////////

  data_servicios: any;
  data_estudios: any = [];
  datos: any = [];
  estudiosSerRad: any = [];
  estudiosSerEco: any = []; 
  resp_reserva_eco: any = [];
  resp_reserva: any = [];
  data_fechaDisp: any = [];
  data_fichas: any = [];
  data_fichas_disponibles: any = [];

  ////////////////////////////

  newForm = this.fb.group({
  });
  
  dataSource: MatTableDataSource<estudiosSeleccionados>;
  dataSourceRyx: MatTableDataSource<fichasDisponibles>;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private EmergenciasService: EmergenciasService,
    public dialogRef: MatDialogRef<DialogReservaFichasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

    this.datosReserva = data;
    console.log('datosReserva', this.datosReserva);
    this.dataSource = new MatTableDataSource();
    this.dataSourceRyx = new MatTableDataSource();  

  }

  //dataSource = ELEMENT_DATA;

  ngOnInit(): void {
    this.listar_servicios();
    
    //this.listar_estudios();
  }


  cerrar(){
    this.dialogRef.close();
  }

  listar_servicios() {
      this.sql = {
        consulta: 'select * from servicios_complementarios.sp_listar_servicios_complementarios('+ this.CODIGO_HOSPITAL +')'
      };
      this.EmergenciasService.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          this.data_servicios = this.responde.success.data[0].sp_dinamico;
          console.log('LISTADO SERVICIOS', this.data_servicios);
        } else {
          this.data_servicios = [];
        }
      });
  }

  listar_estudios() {
    try {
      this.sql = {
        consulta: 'select * from servicios_complementarios.sp_lst_estudios($$RAYOS X$$,' + this.CODIGO_HOSPITAL + ',$$INSTITUCIONAL$$)'
      };
      this.EmergenciasService.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        if (this.responde.success.data[0].sp_dinamico != null) {
          this.data_estudios = this.responde.success.data[0].sp_dinamico;
          console.log('LISTADO ESTUDIOS', this.data_estudios);
        } else {
          this.data_estudios = [];
        }
      });
    } catch (error) {
      console.log('POR ERROR');
    }
  }


  seleccion_estudio(value: any) {
    console.log('SELECCION DEL ESTUDIO', value);

    /*var params_loginifacturas = {
      'usr_usuario': 'supervisor.cotahuma',
      'usr_clave': '123456'
    }
    this.EmergenciasService.login_ifacturas(params_loginifacturas).subscribe(res => {
      var response_login = res;
      console.log('response_login', response_login);
      this.token_facturas = response_login.token;
      console.log(this.token_facturas);
    });*/

    /*var params_itemsSierra = {
      'id_sucursal': 154,
      'id_grupo_item': '72'
    }
    this.EmergenciasService.listado_items_sierra(params_itemsSierra, this.token_facturas).subscribe(res => {
      var response_itemsSierra = res.success.data;
      console.log('response_itemsSierra', response_itemsSierra);
    });*/
    if (this.descServicio == 'RADIOLOGIA') {
      console.log('Entro por RADIOLOGIA');
      for (let i = 0; i < this.data_estudios.length; i++) {
        const element = this.data_estudios[i];
        if(element.est_id == value){
          console.log('TRUE', element);
          if (element.o_itm_cobro == 'SI') {
            this.estudiosSerRad.push({
              o_item_cod_item: this.data_estudios[i].o_item_cod_item,
              descripcion: this.data_estudios[i].est_descripcion,
              tiempo: this.data_estudios[i].est_tiempo,
              preparacion: this.data_estudios[i].est_preparacion,
              precio: 'PRECIO',
              o_scrl_idsuculsal: this.data_estudios[i].o_scrl_idsuculsal,
              o_itm_cod_grupo_items: this.data_estudios[i].o_itm_cod_grupo_items,
              o_itm_vgrucodigo_siaf: this.data_estudios[i].o_itm_vgrucodigo_siaf,
              o_itm_vsercodigo_siaf: this.data_estudios[i].o_itm_vsercodigo_siaf,
              o_itm_cobro: this.data_estudios[i].o_itm_cobro
            });
          } else {
            this.estudiosSerRad.push({
              o_item_cod_item: this.data_estudios[i].o_item_cod_item,
              descripcion: this.data_estudios[i].est_descripcion,
              tiempo: this.data_estudios[i].est_tiempo,
              preparacion: this.data_estudios[i].est_preparacion,
              precio: '0',
              o_scrl_idsuculsal: this.data_estudios[i].o_scrl_idsuculsal,
              o_itm_cod_grupo_items: this.data_estudios[i].o_itm_cod_grupo_items,
              o_itm_vgrucodigo_siaf: this.data_estudios[i].o_itm_vgrucodigo_siaf,
              o_itm_vsercodigo_siaf: this.data_estudios[i].o_itm_vsercodigo_siaf,
              o_itm_cobro: this.data_estudios[i].o_itm_cobro
            });
          } 
        }
      }
      console.log('NUEVO ESTUDIO RADIOLOGIA', this.estudiosSerRad);
      this.dataSource = new MatTableDataSource(this.estudiosSerRad);
    } else {
      console.log('Entro por ECOGRAFIA');
      for (let i = 0; i < this.data_estudios.length; i++) {
        const element = this.data_estudios[i];
        if(element.est_id == value){
          console.log('TRUE', element);
          if (element.o_itm_cobro == 'SI') {
            this.estudiosSerEco.push({
              o_item_cod_item: this.data_estudios[i].o_item_cod_item,
              descripcion: this.data_estudios[i].est_descripcion,
              tiempo: this.data_estudios[i].est_tiempo,
              preparacion: this.data_estudios[i].est_preparacion,
              precio: '10',
              o_scrl_idsuculsal: this.data_estudios[i].o_scrl_idsuculsal,
              o_itm_cod_grupo_items: this.data_estudios[i].o_itm_cod_grupo_items,
              o_itm_vgrucodigo_siaf: this.data_estudios[i].o_itm_vgrucodigo_siaf,
              o_itm_vsercodigo_siaf: this.data_estudios[i].o_itm_vsercodigo_siaf,
              o_itm_cobro: this.data_estudios[i].o_itm_cobro
            });
          } else {
            this.estudiosSerEco.push({
              o_item_cod_item: this.data_estudios[i].o_item_cod_item,
              descripcion: this.data_estudios[i].est_descripcion,
              tiempo: this.data_estudios[i].est_tiempo,
              preparacion: this.data_estudios[i].est_preparacion,
              precio: '0',
              o_scrl_idsuculsal: this.data_estudios[i].o_scrl_idsuculsal,
              o_itm_cod_grupo_items: this.data_estudios[i].o_itm_cod_grupo_items,
              o_itm_vgrucodigo_siaf: this.data_estudios[i].o_itm_vgrucodigo_siaf,
              o_itm_vsercodigo_siaf: this.data_estudios[i].o_itm_vsercodigo_siaf,
              o_itm_cobro: this.data_estudios[i].o_itm_cobro
            });
          } 
        }
      }
      console.log('NUEVO ESTUDIO', this.estudiosSerEco);
      this.dataSource = new MatTableDataSource(this.estudiosSerEco);
    }
  }


  asignar_servicio(dataServicio: any){
    console.log('DATOS SERVICIO', dataServicio);
    
    this.servicioSeleccionado = dataServicio;
    this.idServicio = dataServicio.idservicios;
    this.descServicio = dataServicio.scdescripcion;
    console.log('this.descServicio', this.descServicio);

    if (dataServicio.scdescripcion == 'RADIOLOGIA') {
      console.log('por radiologia');
      this.estudiosSerRad = [];
      try {
        this.sql = {
          consulta: 'select * from servicios_complementarios.sp_lst_estudios($$RAYOS X$$,' + this.CODIGO_HOSPITAL + ',$$INSTITUCIONAL$$)'
        };
        this.EmergenciasService.dinamico(this.sql).subscribe(res => {
          this.responde = res as { message: string };
          if (this.responde.success.data[0].sp_dinamico != null) {
            this.data_estudios = this.responde.success.data[0].sp_dinamico;
            console.log('LISTADO ESTUDIOS', this.data_estudios);
            this.habServicio = true;
            this.habEstudios = true;
            this.habServicioEco = false;
            this.habEstudioInst = false;
            this.habEstudioLey = true;
            this.habEstudioSoat = true;
            this.habResrvFich = false;
            this.habListFichas = false;
            this.listar_fechas_disponibles();
            //this.listar_fichas();
          } else {
            this.data_estudios = [];
          }
        });
      } catch (error) {
        console.log('ERROR', error);
      }
    } else {
      console.log('por ecografia');
      this.estudiosSerEco = [];
      try {
        this.sql = {
          consulta: 'select * from servicios_complementarios.sp_lst_estudios($$ECOGRAFIA$$,' + this.CODIGO_HOSPITAL + ',$$INSTITUCIONAL$$)'
        };
        this.EmergenciasService.dinamico(this.sql).subscribe(res => {
          this.responde = res as { message: string };
          if (this.responde.success.data[0].sp_dinamico != null) {
            this.data_estudios = this.responde.success.data[0].sp_dinamico;
            console.log('LISTADO ESTUDIOS', this.data_estudios);
            this.habServicio = false;
            this.habEstudios = true;
            this.habServicioEco = true;
            this.habEstudioInst = false;
            this.habEstudioLey = true;
            this.habEstudioSoat = true;
            this.habResrvFich = false;
            this.habListFichas = false;
          } else {
            this.data_estudios = [];
          }
        });
      } catch (error) {
        console.log('POR ERROR');
      }
    }
  }

  cambiar_tipo_institucional(){
    console.log('CAMBIO DE DATOS A INSTITUCIONALES');
    if (this.servicioSeleccionado == 'RADIOLOGIA') {
      console.log('por radiologia');
      try {
        this.sql = {
          consulta: 'select * from servicios_complementarios.sp_lst_estudios($$RAYOS X$$,' + this.CODIGO_HOSPITAL + ',$$INSTITUCIONAL$$)'
        };
        this.EmergenciasService.dinamico(this.sql).subscribe(res => {
          this.responde = res as { message: string };
          if (this.responde.success.data[0].sp_dinamico != null) {
            this.data_estudios = this.responde.success.data[0].sp_dinamico;
            console.log('LISTADO ESTUDIOS', this.data_estudios);
            this.habServicio = true;
            this.habEstudios = true;
            this.habServicioEco = false;
            this.habEstudioInst = false;
            this.habEstudioLey = true;
            this.habEstudioSoat = true;
            this.habResrvFich = false;
            this.habListFichas = false;
          } else {
            this.data_estudios = [];
          }
        });
      } catch (error) {
        console.log('POR ERROR');
      }
    } else {
      console.log('por ecografia');
      try {
        this.sql = {
          consulta: 'select * from servicios_complementarios.sp_lst_estudios($$ECOGRAFIA$$,' + this.CODIGO_HOSPITAL + ',$$INSTITUCIONAL$$)'
        };
        this.EmergenciasService.dinamico(this.sql).subscribe(res => {
          this.responde = res as { message: string };
          if (this.responde.success.data[0].sp_dinamico != null) {
            this.data_estudios = this.responde.success.data[0].sp_dinamico;
            console.log('LISTADO ESTUDIOS', this.data_estudios);
            this.habServicio = false;
            this.habEstudios = true;
            this.habServicioEco = true;
            this.habEstudioInst = false;
            this.habEstudioLey = true;
            this.habEstudioSoat = true;
            this.habResrvFich = false;
            this.habListFichas = false;
          } else {
            this.data_estudios = [];
          }
        });
      } catch (error) {
        console.log('POR ERROR');
      }
    }
  }

  cambiar_tipo_sus(){
    console.log('CAMBIO DE DATOS SUS - LEY');
    if (this.servicioSeleccionado == 'RADIOLOGIA') {
      console.log('por radiologia');
      try {
        this.sql = {
          consulta: 'select * from servicios_complementarios.sp_lst_estudios($$RAYOS X$$,' + this.CODIGO_HOSPITAL + ',$$SUS - LEY 1152$$)'
        };
        this.EmergenciasService.dinamico(this.sql).subscribe(res => {
          this.responde = res as { message: string };
          if (this.responde.success.data[0].sp_dinamico != null) {
            this.data_estudios = this.responde.success.data[0].sp_dinamico;
            console.log('LISTADO ESTUDIOS', this.data_estudios);
            this.habServicio = true;
            this.habEstudios = true;
            this.habServicioEco = false;
            this.habEstudioInst = true;
            this.habEstudioLey = false;
            this.habEstudioSoat = true;
            this.habResrvFich = false;
            this.habListFichas = false;
          } else {
            this.data_estudios = [];
          }
        });
      } catch (error) {
        console.log('POR ERROR');
      }
    } else {
      console.log('por ecografia');
      try {
        this.sql = {
          consulta: 'select * from servicios_complementarios.sp_lst_estudios($$ECOGRAFIA$$,' + this.CODIGO_HOSPITAL + ',$$SUS - LEY 1152$$)'
        };
        this.EmergenciasService.dinamico(this.sql).subscribe(res => {
          this.responde = res as { message: string };
          if (this.responde.success.data[0].sp_dinamico != null) {
            this.data_estudios = this.responde.success.data[0].sp_dinamico;
            console.log('LISTADO ESTUDIOS', this.data_estudios);
            this.habServicio = false;
            this.habEstudios = true;
            this.habServicioEco = true;
            this.habEstudioInst = true;
            this.habEstudioLey = false;
            this.habEstudioSoat = true;
            this.habResrvFich = false;
            this.habListFichas = false;
          } else {
            this.data_estudios = [];
          }
        });
      } catch (error) {
        console.log('POR ERROR');
      }
    }
  }

  cambiar_tipo_soat(){
    console.log('CAMBIO DE DATOS A SOAT');
    if (this.servicioSeleccionado == 'RADIOLOGIA') {
      console.log('por radiologia');
      try {
        this.sql = {
          consulta: 'select * from servicios_complementarios.sp_lst_estudios($$RAYOS X$$,' + this.CODIGO_HOSPITAL + ',$$SOAT$$)'
        };
        this.EmergenciasService.dinamico(this.sql).subscribe(res => {
          this.responde = res as { message: string };
          if (this.responde.success.data[0].sp_dinamico != null) {
            this.data_estudios = this.responde.success.data[0].sp_dinamico;
            console.log('LISTADO ESTUDIOS', this.data_estudios);
            this.habServicio = true;
            this.habEstudios = true;
            this.habServicioEco = false;
            this.habEstudioInst = true;
            this.habEstudioLey = true;
            this.habEstudioSoat = false;
            this.habResrvFich = false;
            this.habListFichas = false;
          } else {
            this.data_estudios = [];
          }
        });
      } catch (error) {
        console.log('POR ERROR');
      }
    } else {
      console.log('por ecografia');
      try {
        this.sql = {
          consulta: 'select * from servicios_complementarios.sp_lst_estudios($$ECOGRAFIA$$,' + this.CODIGO_HOSPITAL + ',$$SOAT$$)'
        };
        this.EmergenciasService.dinamico(this.sql).subscribe(res => {
          this.responde = res as { message: string };
          if (this.responde.success.data[0].sp_dinamico != null) {
            this.data_estudios = this.responde.success.data[0].sp_dinamico;
            console.log('LISTADO ESTUDIOS', this.data_estudios);
            this.habServicio = false;
            this.habEstudios = true;
            this.habServicioEco = true;
            this.habEstudioInst = true;
            this.habEstudioLey = true;
            this.habEstudioSoat = false;
            this.habResrvFich = false;
            this.habListFichas = false;
          } else {
            this.data_estudios = [];
          }
        });
      } catch (error) {
        console.log('POR ERROR');
      }
    }
  }

  reserva_sin_fichas(){
    console.log('RESERVA SIN FICHAS');

    this.sql = {
      consulta: 'select * from servicios_complementarios.sp_asignar_ficha('+ this.SIIS +','+ this.CODIGO_HOSPITAL +',$$'+ JSON.stringify(this.estudiosSerRad) +'$$,'+ this.IDESPECIALIDAD +','+ this.IDUSUARIO +','+ this.idServicio +',$$1999-01-01$$,$$EMERGENCIAS$$,1,$$RXY/00$$,$$$$,$$NO$$,'+ this.IDUSUARIO +',$$$$,$$*U07.2-COVID-19 ,virus no identificado-N$$,$$$$)'
    };
    this.EmergenciasService.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.resp_reserva = this.responde.success.data[0].sp_dinamico;
        console.log('RESPUESTA DE RESERVA', this.resp_reserva);
      } else {
        console.log('POR ERROR');
      }
    });
  }

  reserva_con_fichas(){
    console.log('RESERVA CON FICHAS');
    this.habResrvFich = true;
  }


  
  reserva_sin_fichas_eco(){
    console.log('RESERVA CON FICHAS');

    this.sql = {
      consulta: 'select * from servicios_complementarios.sp_asignar_ficha_ecografia_mejorado($$$$,1,$$E$$,'+ this.SIIS +','+ this.CODIGO_HOSPITAL +',$$'+ JSON.stringify(this.estudiosSerRad) +'$$,'+ this.IDESPECIALIDAD +','+ this.IDUSUARIO +','+ this.idServicio +',$$1993-04-07$$,$$EMERGENCIAS$$,$$NORMAL$$,$$NO$$,'+ this.IDUSUARIO +',$$*U07.2-COVID-19 ,virus no identificado-N$$,$$$$)'
    };
    this.EmergenciasService.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.resp_reserva_eco = this.responde.success.data[0].sp_dinamico;
        console.log('RESERVA DE ECO', this.resp_reserva_eco);
      } else {
        console.log('POR ERROR');
      }
    });
  }

  derivar_a_programacion(){
    console.log('RESERVA SIN FICHAS');
  }




  listar_fechas_disponibles(){
    console.log('RESERVA CON FICHAS');
    this.sql = {
      consulta: 'select * from servicios_complementarios.sp_lst_fechas('+ this.CODIGO_HOSPITAL +','+ this.idServicio +')'
    };
    console.log('this.sql', this.sql);
    this.EmergenciasService.dinamico(this.sql).subscribe(res => {
    this.responde = res as { message: string };
    console.log('this.responde', this.responde);
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.data_fechaDisp = this.responde.success.data[0].sp_dinamico;
        console.log('RESPUESTA DE LISTADO DE FICHAS', this.data_fechaDisp);
      } else {
        console.log('POR ERROR');
      }
    });
  }

  seleccion_fechaDisponible(fecha: any){
    console.log('SELECCION DEL ESTUDIO', fecha);
    this.sql = {
      consulta: 'select * from servicios_complementarios.sp_lst_medicos_servicios('+ this.CODIGO_HOSPITAL +','+ this.idServicio +',$$'+fecha+'$$)'
    };
    this.EmergenciasService.dinamico(this.sql).subscribe(res => {
    this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.data_fichas = this.responde.success.data[0].sp_dinamico;
        console.log('RESPUESTA DE LISTADO DE FICHAS', this.data_fichas);
        this.dataSourceRyx = this.data_fichas;
      } else {
        console.log('POR ERROR');
      }
    });
  }
  
  
  listar_fichas(){
    console.log('LISTAR FICHAS');
    this.sql = {
      consulta: 'select * from servicios_complementarios.sp_lst_medicos_servicios('+ this.CODIGO_HOSPITAL +','+ this.idServicio +',$$2022-09-22$$)'
    };
    this.EmergenciasService.dinamico(this.sql).subscribe(res => {
    this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.data_fichas = this.responde.success.data[0].sp_dinamico;
        console.log('RESPUESTA DE LISTADO DE FICHAS', this.data_fichas);
        this.dataSourceRyx = this.data_fichas;
      } else {
        console.log('POR ERROR');
      }
    });
  }

  listar_fichas_disponibles(value: any){
    console.log('LISTAR FICHAS', value);
    this.idTurno = value.vtrn_id;
    this.sql = {
      consulta: 'select * from servicios_complementarios.sp_lst_fichas_turnos('+ this.idTurno +')'
    };
    this.EmergenciasService.dinamico(this.sql).subscribe(res => {
    this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.data_fichas_disponibles = this.responde.success.data[0].sp_dinamico[0].vtrn_cod_fichas;
        console.log('RESPUESTA DE LISTADO DE FICHAS', this.data_fichas_disponibles);
        this.habListFichas = true;
      } else {
        console.log('POR ERROR');
      }
    });
  }


  seleccionar_ficha(fichas: any){
    console.log('fichas', fichas);
    this.sql = {
      consulta: 'select * from servicios_complementarios.sp_asignar_ficha('+ this.SIIS +','+ this.CODIGO_HOSPITAL +',$$'+ JSON.stringify(this.estudiosSerRad) +'$$,'+ this.IDESPECIALIDAD +','+ this.IDUSUARIO +','+ this.idServicio +',$$'+ fichas.Fecha +'$$,$$EMERGENCIAS$$,'+ this.idTurno +',$$'+ fichas.Ficha +'$$,$$'+ fichas.Reservada +'$$,$$NO$$,'+ this.IDUSUARIO +',$$$$,$$$$,$$$$)'
    };
    this.EmergenciasService.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.resp_reserva = this.responde.success.data[0].sp_dinamico;
        console.log('RESPUESTA DE RESERVA', this.resp_reserva);
        this.lista_fichas(this.idTurno);

      } else {
        console.log('POR ERROR');
      }
    });
  }

  lista_fichas(value: any){
    this.sql = {
      consulta: 'select * from servicios_complementarios.sp_lst_fichas_turnos('+ value +')'
    };
    this.EmergenciasService.dinamico(this.sql).subscribe(res => {
    this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        this.data_fichas_disponibles = this.responde.success.data[0].sp_dinamico[0].vtrn_cod_fichas;
        console.log('RESPUESTA DE LISTADO DE FICHAS', this.data_fichas_disponibles);
        this.habListFichas = true;
      } else {
        console.log('POR ERROR');
      }
    });
  }


}
