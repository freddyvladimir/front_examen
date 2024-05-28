import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { EmergenciasService } from '../emergencias.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { DatosPacientesComponent } from '../../../componentes/datos-pacientes/datos-pacientes.component';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { style } from '@angular/animations';
import { Cie10Component } from 'app/routes/componentes/cie10/cie10.component';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export interface programaData {
}

@Component({
  selector: 'app-page-medico-emergencias',
  templateUrl: './page-medico-emergencias.component.html',
  styleUrls: ['./page-medico-emergencias.component.scss']
})
export class PageMedicoEmergenciasComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  
  isEditable = false;
  isLinear = true;
  
  var_pdf_fecha_hora: string = new Date().toLocaleString();
  var_pdf_fecha: string = new Date().toLocaleString().substring(0,8);
  var_pdf_hora: string = new Date().toLocaleString().substring(10,18);
  var_pdf_ci: string = '';
  var_pdf_data: any;
  new_data_table: boolean = false;
  var_siis: string = '';
  var_sice: string = '';
  var_paciente: string = '';
  var_paciente_tipo: string = '';
  new_contenedor_data: boolean = false;
  new_alta_solicitada: boolean = false;
  new_buscador: boolean = true;
  var_diagnostico_ingreso: string = '';
  var_diagnostico_egreso: string = '';
  variable_derivar_lista_medicos: any;
  container_derivar_lista_medicos: boolean = false;
  value = '';

  displayedColumns: string[] = [
    'id',
    'siis',
    'sice',
    'fecha',
    'paciente',
    'servicio',
    'tipo',
    'estado',
    'acciones'];
   
    
    pacienteForm = this.fb.group({
      input_siis: [''],
      input_sice: [''],
      input_tipo: [''],
      input_hora: [''],
      input_fecha_ingreso: [''],
      input_fecha_nacimiento: [''],
      input_edad: [''],
      input_peso: [''],
      input_estatura: [''],
      input_masa: [''],
      input_presion_arterial: [''],
      input_frecuencia_respiratoria: [''],
      input_temperatura_axilar:[''],
      input_temperatura_oral: [''],
      input_temperatura_rectal: [''],
      input_frecuencia_cardiaca: [''],
      input_saturacion_oxigeno: [''],
      input_llenado_capilar: [''],
      input_motivo_consulta: [''],
      input_enfermedad_actual: [''],
      input_antecedente_patologico: [''],
      input_total: [''],
      input_od: [''],
      input_oi: [''],
      input_craneo_facial: [''],
      input_piel_mucosas: [''],
      input_cardiaco: [''],
      input_pulmonar: [''],
      input_abdomen: [''],
      input_genito_urinario: [''],
      input_extremidades: [''],
      input_otros: [''],
      input_anamnesis: [''],
      input_examen_fisico:[''],
      input_diagnostico_ingreso:[''],
      input_diagnostico_egreso:[''],
      input_impresion_diagnostico_egreso:[''],
    }); 
  
  
  dataSource: MatTableDataSource<programaData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datos_programacion: any;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });


  constructor(private fb: FormBuilder,private toastr: ToastrService, public dialog: MatDialog, private emergenciasService: EmergenciasService) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.paciente_lista_medicos();
    console.log(localStorage.getItem('userID'));
  }
  
  recargar() {
    this.dataSource = new MatTableDataSource(this.datos_programacion);
    this.ngAfterViewInit();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    try {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } catch (error) {

    }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  buttom_derivar(estado:boolean){
    this.container_derivar_lista_medicos = estado;
  }
  container_button_bloque(){
    console.log('pedro');
  }

  listPacientes(type: string, event: MatDatepickerInputEvent<Date>) {
    const fechaCadena = JSON.stringify(event.value);
    const fecha = fechaCadena.substring(1, 11);
    /*var params_buscar = {
      "hspid": 5,
      "tfecha": "2021-08-13",
      "vid_usr": 1050
    }*/
    var params_buscar = {
      "hspid": this.CODIGO_HOSPITAL,
      "tfecha": fecha,
      "vid_usr": 1050
    }
    /*var params_buscar = {
      "hspid": 5,
      "tfecha": "2018-10-11",
      "vid_usr": 1050
    }*/

    this.emergenciasService.buscar(params_buscar).subscribe(res => {
      this.new_data_table = true;
      var response_buscar = res;    
      this.dataSource = new MatTableDataSource(response_buscar.success.data);
      this.ngAfterViewInit();
      
    });
  }

  paciente_lista_medicos() {
    var params_buscar = {
      "hspid": this.CODIGO_HOSPITAL,
      "vusr_id": 1050
    }
    this.emergenciasService.derivar_lista_medicos(params_buscar).subscribe(res => {
      this.variable_derivar_lista_medicos = res.success.data;    
    });
  }

  atenderPaciente(row:any){
    console.log(row);
    this.var_pdf_data = row;
    if(this.var_pdf_data.pressexo=='1'){
      this.var_pdf_data.pressexo = 'MASCULINO';
    } else{
      this.var_pdf_data.pressexo = 'FEMENINO';
    }
    this.var_pdf_ci = row.cipaciente;
    var response_asistencia;
    let nro_cubiculo = 0;
    this.var_paciente_tipo = row.vhcl_tp_id;
    this.var_paciente = row.vpaciente;
    this.var_sice = row.vhcl_codigoseg;
    this.var_siis = row.dtspslid;
    this.new_contenedor_data = true;
    this.new_data_table = false;
    this.new_buscador = false;
    var params_asistencia = {
      "cod_siis": row.dtspslid,
      "hspid": parseInt(row.vhcl_hsp_id),
      "idpres": row.prsid
    }
    this.emergenciasService.asistencia(params_asistencia).subscribe(res => {      
      response_asistencia = res.success.data; 
      nro_cubiculo =  parseInt(response_asistencia[0].nrocubiculo);
      console.log(response_asistencia);
      this.pacienteForm = this.fb.group({
        input_tipo: [this.var_paciente_tipo],
        input_hora: [response_asistencia[0].horaatencion],
        input_fecha_ingreso: [response_asistencia[0].fechaatencion],
        input_fecha_nacimiento: [response_asistencia[0].fecha_nac],
        input_edad: [response_asistencia[0].edad],
        input_peso: [response_asistencia[0].peso],
        input_estatura: [response_asistencia[0].estatura],
        input_masa: [response_asistencia[0].indicemasa],
        input_presion_arterial: [response_asistencia[0].presionalterial],
        input_frecuencia_respiratoria:[response_asistencia[0].frecuenciaresp],
        input_temperatura_axilar: [response_asistencia[0].temperatura],
        input_temperatura_oral: [response_asistencia[0].temperatura],
        input_temperatura_rectal: [response_asistencia[0].temperatura],
        input_frecuencia_cardiaca: [response_asistencia[0].pulso],
        input_saturacion_oxigeno: [response_asistencia[0].saturacion],
        input_llenado_capilar: [response_asistencia[0].llenadocapilar],
      });      
    })

    var params_cubiculo = {
      "hosid": parseInt(row.vhcl_hsp_id)
    }
    this.emergenciasService.cubiculo(params_cubiculo).subscribe(res => {
      var response_cubiculo = res.success.data;
      console.log(response_cubiculo);
      for(let j=0; j < response_cubiculo.length; j++){
        if(response_cubiculo[j].vcub_id==nro_cubiculo){
          console.log(response_cubiculo[j]);
          this.pacienteForm = this.fb.group({
            input_sice: [response_cubiculo[j].vcub_descripcion],
          });
          break;
        }
        
      }    
      
      
    });    
  }

  onSubmitPaciente() {
      const body = this.pacienteForm.value;
      body.cnsl_usuario_id = 1;
      body.cnsl_hsp_id = this.CODIGO_HOSPITAL;
      console.log(body);
      
      /*this.parametricasService.postConsultorio(body).subscribe(resp => {
          this.dialogRef.close('true');
      });*/
      
  }

  total(data:any){
    var var_total = parseInt(data.ocular) + parseInt(data.motora) + parseInt(data.verbal);
    this.pacienteForm = this.fb.group({
      input_total: [var_total]
    });
    
  }

  cie10_ingreso() {
    this.dialog.open(Cie10Component, {
        width: '1300px',
    }).afterClosed().subscribe(result => {
        this.var_diagnostico_ingreso = this.var_diagnostico_ingreso+result;
        this.pacienteForm = this.fb.group({
          input_diagnostico_ingreso: [this.var_diagnostico_ingreso]
        });
      });
  }

  limpiar_ingreso(){
    this.var_diagnostico_ingreso = '';
    this.pacienteForm = this.fb.group({
      input_diagnostico_ingreso: [this.var_diagnostico_ingreso]
    })
  }

  cie10_egreso() {
    this.dialog.open(Cie10Component, {
        width: '1300px',
    }).afterClosed().subscribe(result => {
        this.var_diagnostico_egreso = this.var_diagnostico_egreso+result;
        this.pacienteForm = this.fb.group({
          input_diagnostico_egreso: [this.var_diagnostico_egreso]
        });
      });
  }

  limpiar_egreso(){
    this.var_diagnostico_egreso = '';
    this.pacienteForm = this.fb.group({
      input_diagnostico_egreso: [this.var_diagnostico_egreso]
    });
  }
  
  alta_solicitada_boton(data:any){
    if(data.alta == 'SI'){
      this.new_alta_solicitada = true;
    }else{
      this.new_alta_solicitada = false;
    }
  }

  alta_solicitada(){
 
    const pdfDefinition: any = {
      content: [
        {
          text: this.var_pdf_fecha_hora,
          style: 'fecha'
        },
        
        {
          
          columns: [
            
            {
              image: "data:image/jpeg;base64,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"
              ,width: 120,
              height: 120,
            },
              
            [
              { 
                text: '\n\n\n HOSPITAL MUNICIPAL COTAHUMA',
                style: 'header'
              },
              {
                text: 'ALTA SOLICITADA',
                style: 'header'
              }
            ],
            {}
          ]
        },
        "\n",

        {
          text: [
            'Yo',
            {text:  ' '+ this.var_paciente+' ',  bold: true},
            'de CI:',
            {text:  ' '+ this.var_pdf_ci+' ',  bold: true},
            'y/o nosotros en pleno conocimiento de la patología(enfermedad) con la que curso(a) y los riesgos posteriores:por voluntad propia rechazo(mos) todo tratamiento médico o quirúrgico: responsabilizándome(nos) por las complicaciones posteriores y deslindando de toda responsabilidad al personal médico del hospital de futuros problemas posteriores al abandono del establecimiento.'
          ],
          
          style: 'body'
        },
        "\n\n\n\n\n\n\n",
        {
          
          columns: [
            
            [
              { 
                text: '--------------------------------------',
                style: 'header'
              },
              {
                text: 'FIRMA DEL PACIENTE',
                style: 'firma'
              }
            ],
              
            [
              { 
                text: '--------------------------------------',
                style: 'header'
              },
              {
                text: 'SELLO Y FIRMA MÉDICO',
                style: 'firma'
              }
            ],
            
          ]
        },
        "\n\n\n\n\n\n\n\n\n\n",
        {
          text: [
            'Ciudad de La Paz,',
            {text:  ' '+ this.var_pdf_fecha,  bold: true}          
          ],
          style: 'body'
        },
        
      ],
      styles: {
        header: {
          fontSize: 12,
          alignment: 'center',
          bold: true
        },
        bigger: {
          fontSize: 15,
          italics: true
        },
        fecha: {
          fontSize: 8
        },
        body:{
          alignment: 'justify',
        },
        firma: {
          fontSize: 10,
          alignment: 'center',
          bold: true
        },
      
      },
      defaultStyle: {
        columnGap: 20
      }
      
    }
 
    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
 
  }
  
  imprimir_formulario(){
 
    const pdfDefinition: any = {
      content: [
        {
          text: this.var_pdf_fecha_hora,
          style: 'fecha'
        },
        
        {
          
          columns: [
            
            {
              image: "data:image/jpeg;base64,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"
              ,width: 120,
              height: 120,
            },
              
            [
              { 
                text: '\n\n\n Gobierno Autónomo Municipal de La Paz',
                style: 'header'
              },
              {
                text: '\n Hospital Municipal Cotahuma',
                style: 'header'
              },
              {
                text: '\n HISTORIA CLÍNICA DE EMERGENCIAS',
                style: 'header'
              }
            ],
            {
              image:"data:image/png;base64,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",
              width: 90,
              height: 90,
            }
          ]
        },

        {
          style: 'tableExample',
          table: {
            widths: [42, 63, 50, 40, 48, 50, 60, 16],
            body: [
              [
                {
                  border: [false, false, false, false],
                  text: 'FECHA:',
                  style: 'tableHeader'
                },
                {
                  text: this.var_pdf_fecha,
                  style: 'text'
                },
                {
                  border: [false, false, false, false],
                  text: '',
                } ,
                {
                  border: [false, false, false, false],
                  text: 'HORA:',
                  style: 'tableHeader'
                },
                {
                  text: this.var_pdf_hora,
                  style: 'text'
                }, 
                {
                  border: [false, false, false, false],
                  text: '',
                }, 
                {
                  border: [false, false, false, false],
                  text: 'Nª de E C:',
                  style: 'tableHeader'
                },
                {
                  text: '53',
                  style: 'text'
                }, 
              ]
              
            ]
          }
        },
        "\n",
        {
          style: 'tableExample',
          table: {
            widths: [50, 6, 33, 90, 6, 32,40, 6, 32, 40, 6],
            body: [
              [
                {
                  border: [false, false, false, false],
                  text: 'LEY 475:',
                  style: 'tableHeader'
                }, 
                '',
                {
                  border: [false, false, false, false],
                  text: '',
                },
                {
                  border: [false, false, false, false],
                  text: 'INSTITUCIONAL:',
                  style: 'tableHeader'
                }, 
                {
                  text: 'X',
                  style: 'text'
                },
                {
                  border: [false, false, false, false],
                  text: '',
                  style: 'tableHeader'
                }, 
                {
                  border: [false, false, false, false],
                  text: 'SOAT:',
                  style: 'tableHeader'
                }, 
                '',
                {
                  border: [false, false, false, false],
                  text: '',
                  style: 'tableHeader'
                },
                {
                  border: [false, false, false, false],
                  text: 'OTRO:',
                  style: 'tableHeader'
                }, 
                ''
              ]
              
            ]
          }
        },
        "\n",
        {text: 'FILIACIÓN', style: 'subheader'},
        {
          style: 'tableExample',
          color: '#444',
          table: {
            widths: ['*', '*','*', '*','*','*'],
            headerRows: 2,
            body: [
              [{text: 'NOMBRES', style: 'tableHeader', colSpan: 3, alignment: 'center'}, {},{}, {text: 'APELLIDO\n PATERNO', style: 'tableHeader', alignment: 'center'}, {text: 'APELLIDO PATERNO', style: 'tableHeader', alignment: 'center'}, {text: 'AP /\nCASADA', style: 'tableHeader', alignment: 'center'}],
            
              [{text: this.var_pdf_data.vdtspsl_nombres, style:'text', colSpan: 3, alignment: 'center'},{},{}, {text: this.var_pdf_data.vdtspsl_paterno, style:'text', alignment: 'center'}, {text: this.var_pdf_data.vdtspsl_materno, style:'text', alignment: 'center'},{}],

              [{text: 'EDAD', style: 'tableHeader',alignment: 'center'}, {text: 'FECHA/NAC', style: 'tableHeader',alignment: 'center'},{text: 'SEXO', style: 'tableHeader',alignment: 'center'}, {text: 'C.I. ', style: 'tableHeader', alignment: 'center'}, {text: 'DIRECCIÓN', style: 'tableHeader', alignment: 'center'}, {text: 'TELÉFONO', style: 'tableHeader', alignment: 'center'}],

              [{text: this.var_pdf_data.edad, style:'text', alignment: 'center'},{text: this.var_pdf_data.pacfecnacimiento, style:'text', alignment: 'center'},{text: this.var_pdf_data.pressexo, style:'text', alignment: 'center'}, {text: this.var_pdf_data.cipaciente , style:'text', alignment: 'center'}, {text: this.var_pdf_data.vdtspsl_direccion, style:'text', alignment: 'center'},{text: this.var_pdf_data.vdtspsl_telefono, style:'text', alignment: 'center'}],

              [{text: 'OCUPACION', style: 'tableHeader', colSpan: 2, alignment: 'center'}, {},{text: 'PROCEDENCIA', style: 'tableHeader', colSpan: 2, alignment: 'center'}, {},{text: 'RESIDENCIA', style: 'tableHeader', colSpan: 2, alignment: 'center'}, {}],

              [{text: this.var_pdf_data.vdtspsl_ocupacion, style: 'text', colSpan: 2, alignment: 'center'}, {},{text: 'LA PAZ', style: 'text', colSpan: 2, alignment: 'center'}, {}, {text: this.var_pdf_data.vdtspsl_ocupacion, style: 'text', colSpan: 2, alignment: 'center'}, {}],

              [{text: 'PERSONA ACOMPAÑANTE /\n RESPONSABLE', style: 'tableHeader', colSpan: 3, alignment: 'center'}, {},{},{text: 'PROCEDENCIA', style: 'tableHeader', colSpan: 2, alignment: 'center'}, {},{text: 'TELÉFONO', style: 'tableHeader', alignment: 'center'}],

              [{text: '', style: 'text', colSpan: 3, alignment: 'center'}, {},{},{text: 'null', style: 'text', colSpan: 2, alignment: 'center'}, {},{text: '', style: 'text', alignment: 'center'}],

              [{text:[
                {text: 'CONFIDENCIALIDAD: ', style: 'tableHeader', alignment: 'left'}, 
                {text: 'null', style: 'text', alignment: 'left'}],
                colSpan: 6
               }, 
               {},{},{},{},{}],
            ]
          }
        },
        {text: 'CLASIFICACIÓN DEL TRIAJE', style: 'subheader'},
        {
          style: 'tableExample',
          color: '#444',
          table: {
            widths: ['*', 5,'*', 5,'*',5,'*', 5,'*',5],
            body: [
              [
               {text: 'ROJO', style: 'tableHeader'}, 
               {text: '', style: 'text'}, 
               {text: 'NARANJA', style: 'tableHeader'}, 
               {text: '', style: 'text'},
               {text: 'AMARILLO', style: 'tableHeader'}, 
               {text: 'x', style: 'text'},
               {text: 'VERDE', style: 'tableHeader'}, 
               {text: '', style: 'text'},
               {text: 'AZUL', style: 'tableHeader'}, 
               {text: '', style: 'text'}
              ]
            ]
          }
        },
        {text: 'MOTIVO DE CONSULTA', style: 'subheader'},
        {
          style: 'tableExample',
          color: '#444',
          table: {
            widths: ['*','*'],
            body: [
              [{rowSpan: 2, text: '\n\n', colSpan: 2}, ''],
              ['', '']
            ]
          }
        },
        {text: 'HISTORIA DE LA ENFERMEDAD ACTUAL', style: 'subheader'},
        {
          style: 'tableExample',
          color: '#444',
          table: {
            widths: ['*','*'],
            body: [
              [{rowSpan: 2, text: '\n\n', colSpan: 2}, ''],
              ['', '']
            ]
          }
        },
        {text: 'ANTECEDENTES PERSONALES PATOLÓGICOS', style: 'subheader'},
        {
          style: 'tableExample',
          color: '#444',
          table: {
            widths: ['*','*'],
            body: [
              [{rowSpan: 2, text: '\n\n', colSpan: 2}, ''],
              ['', '']
            ]
          }
        },
        {text: 'SIGNOS VITALES', style: 'subheader'},
        {
          style: 'tableExample',
          color: '#444',
          table: {
            widths: ['*', '*','*', '*','*','*','*','*','*','*',70],
            body: [
              [
               {text: 'P.A.', style: 'tableHeader'}, 
               {text: 'F.C.', style: 'tableHeader'}, 
               {text: 'F.R.', style: 'tableHeader'}, 
               {text: 'Sat\n%O', style: 'tableHeader'},
               {text: 'Tª Oral.', style: 'tableHeader'}, 
               {text: 'Tª Axil.', style: 'tableHeader'},
               {text: 'Tª\nRectal.', style: 'tableHeader'}, 
               {text: 'Peso', style: 'tableHeader'},
               {text: 'Talla', style: 'tableHeader'}, 
               {text: 'Llen/Cap', style: 'tableHeader'},
               {rowSpan: 2, text: ''},
              ],
              [
                {text: '90/60\n(mmHg)', style: 'text'}, 
                {text: '78\n(l/m)', style: 'text'}, 
                {text: '20\n(r/m', style: 'text'}, 
                {text: '96\n(o2)', style: 'text'},
                {text: '37,3\n(ºC)', style: 'text'}, 
                {text: '36,1\n(ºC)', style: 'text'},
                {text: '38,6\nºC)', style: 'text'}, 
                {text: '48,0\n(kg.)', style: 'text'},
                {text: '157\n(cm.)', style: 'text'}, 
                {text: '42\n(seg)', style: 'text'},
                {text: ''},
               ],
               [
                {border: [false, false, false, false], text: ''}, 
                {border: [false, false, false, false], text: ''}, 
                {border: [false, false, false, false], text: ''}, 
                {border: [false, false, false, false], text: ''},
                {border: [false, false, false, false], text: ''}, 
                {border: [false, false, false, false], text: ''},
                {border: [false, false, false, false], text: ''}, 
                {border: [false, false, false, false], text: ''},
                {border: [false, false, false, false], text: ''}, 
                {border: [false, false, false, false], text: ''},
                {border: [false, false, false, false], text: 'FIRMA Y SELLO ENFERMERA QUE TOMA SIGNOS VITALES', style: 'text', fontSize: 6},
               ]
            ]
          }
        },
        {
          text: this.var_pdf_fecha_hora,
          pageBreak: 'before',
          style: 'fecha'
        },
        {text: 'EXAMEN FISICO', style: 'subheader'},
        {
          style: 'tableExample',
          color: '#444',
          table: {
            widths: ['*', '*','*', '*','*'],
            body: [
              [
               {border: [false, false, false, false], text: 'GLASGLOW', style: 'tableHeader', alignment: 'left'}, 
               {border: [false, false, false, false], text: 'APERTURA OCULAR:', style: 'tableHeader', alignment: 'left'}, 
               {border: [false, false, false, false], text: 'RESPUESTA VERBAL:', style: 'tableHeader', alignment: 'left'}, 
               {border: [false, false, false, false], text: 'RESPUESTA MOTORA:', style: 'tableHeader', alignment: 'left'},
               {border: [false, false, false, false], text: 'TOTAL: /15', style: 'tableHeader', alignment: 'left'}
              ],
              [
                {border: [false, false, false, false], text: 'PUPILAS:', style: 'text', alignment: 'left'}, 
                {border: [false, false, false, false], text: 'OD: mm', style: 'text', alignment: 'left'}, 
                {border: [false, false, false, false], text: 'OI: mm', style: 'text', alignment: 'left'}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}
               ],
               [
                {border: [false, false, false, false], text: 'CRANEO-FACIAL:', style: 'text', alignment: 'left'}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}
               ],
               [
                {border: [false, false, false, false], text: 'PIEL Y MUCOSAS:', style: 'text', alignment: 'left'}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}
               ],
               [
                {border: [false, false, false, false], text: 'CARDIACO:', style: 'text', alignment: 'left'}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}
               ],
               [
                {border: [false, false, false, false], text: 'PULMONAR:', style: 'text', alignment: 'left'}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}
               ],
               [
                {border: [false, false, false, false], text: 'ABDOMEN:', style: 'text', alignment: 'left'}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}
               ],
               [
                {border: [false, false, false, false], text: 'GENITO URINARIO: ', style: 'text', alignment: 'left'}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}
               ],
               [
                {border: [false, false, false, false], text: 'EXTREMIDADES:', style: 'text', alignment: 'left'}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}
               ],
               [
                {border: [false, false, false, false], text: 'OTROS:', style: 'text', alignment: 'left'}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}, 
                {border: [false, false, false, false],  text: '',}
               ]
            ]
          }
        },
        {text: 'IMPRESIÓN DIAGNOSTICA', style: 'subheader'},
        {
          style: 'tableExample',
          color: '#444',
          table: {
            widths: ['*', 5, '*'],
            body: [
              [
               {border: [false, false, false, false], text: ''}, 
               {border: [false, false, false, false], text: ''}, 
               {text: 'Llenado solo por Estadística', style: 'text'}
              ],
              [
                {text: '1.-', style: 'tableHeader', alignment: 'left'},
                {border: [false, false, false, false],text: ''},
                {text: 'C.I.E.-10:', style: 'tableHeader'}
               ],
               [
                {border: [false, false, false, false], text: ''},
                {border: [false, false, false, false],text: ''},
                {text: '*J09-Influenza debida a virus de la influenza identificado -N', style: 'text'}
               ]
            ]
          }
        },
        {text: 'TRATAMIENTO Y CONDUCTA AMBULATORIA', style: 'subheader'},
        {
          style: 'tableExample',
          color: '#444',
          table: {
            widths: ['*','*'],
            body: [
              [
               {text: '1.-', alignment: 'left', colSpan: 2}, 
               {}
              ],
              [
                {text: '2.-', alignment: 'left', colSpan: 2}, 
                {}
               ],
               [
                {text: '3.-', alignment: 'left', colSpan: 2}, 
                {}
               ],
              [
                {text:  [
                  { 
                    text: '\n\n\n\n-----------------------------------------------',
                    style: 'tableHeader'
                  },
                  {
                    text: '\nFIRMA Y SELLO DEL MÉDICO',
                    style: 'tableHeader'
                  }
                ]
                },
                {text:  [
                  { 
                    text: '\n\n\n\n-----------------------------------------------',
                    style: 'tableHeader'
                  },
                  {
                    text: '\nFIRMA Y SELLO DE LA\nLICENCIADA EN ENFERMERÍA',
                    style: 'tableHeader'
                  }
                ]
                }
               ]
            ]
          }
        },
        {text: 'REFERENCIA', style: 'subheader'},
        {
          style: 'tableExample',
          color: '#444',
          table: {
            widths: ['*', '*', '*'],
            body: [
              [
               {border: [false, false, false, false], text: 'A:', style: 'tableHeader', alignment: 'left'}, 
               {border: [false, false, false, false], text: 'Coordinado con:', style: 'tableHeader', alignment: 'left'}, 
               {border: [false, false, false, false], text: '', style: 'tableHeader', alignment: 'left'}
              ],
              [
                {border: [false, false, false, false], text: 'Motivo:', style: 'tableHeader', alignment: 'left'},
                {border: [false, false, false, false], text: 'Fecha:', style: 'tableHeader', alignment: 'left'},
                {border: [false, false, false, false], text: 'Hora:', style: 'tableHeader', alignment: 'left'}
               ]
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 9,
          alignment: 'center',
          bold: true
        },
        bigger: {
          fontSize: 15,
          italics: true
        },
        fecha: {
          fontSize: 8
        },
        body:{
          alignment: 'justify',
        },
        firma: {
          fontSize: 10,
          alignment: 'center',
          bold: true
        },
        text: {
          fontSize: 8,
          alignment: 'center',
        },
        tableHeader:{
          fontSize: 10,
          alignment: 'center',
          bold: true
        },
        subheader: {
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        
      
      },
      defaultStyle: {
        columnGap: 20
      }
      
    }
 
    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
 
  }
  

}
