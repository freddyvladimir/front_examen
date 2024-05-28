import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { style } from '@angular/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { EmergenciasService } from '../../../emergencias.service';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


export interface DialogData {
  campos: any;
}

@Component({
  selector: 'app-dialog-derivar-especialidad',
  templateUrl: './dialog-derivar-especialidad.component.html',
  styleUrls: ['./dialog-derivar-especialidad.component.scss']
})
export class DialogDerivarEspecialidadComponent implements OnInit {

  /////////  VARIABLES  ///////////
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  datosPaciente: any;
  respuestaFechaActual: any;
  ID_USUARIO = 1050;
  //value = '';
  //paciente_seleccionado: any;
  tipoBock = false;
  datos: any = []; /////Datos de todo el formulario
  respuestaEspecialidades: any[]=[];
  respuestaMedicos: any[]=[];
  respuestaDerivacion: any[]=[];
  //respuestaEspecialidades: Observable<string[]> | undefined;
  fecha: any;
  datosValoracion: any;
  selecHora: any;
  nuevaHora: any;
  mujer: any;
  varon: any;
  nombreEspecialidad: any;
  /////////  VARIABLES  ///////////



  //////////servicios/////////
  sql: any;
  responde: any;
  result: any;
  //////////servicios/////////


  myControl = new FormControl('');
  //options: string[] = [];
  //filteredOptions: Observable<string[]> | undefined;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public emergenciasService: EmergenciasService,
    public dialogRef: MatDialogRef<DialogDerivarEspecialidadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.datosValoracion = data;
    console.log('datosValoracion', this.datosValoracion); 
    this.formDatosPaciente = this.fb.group({
      tipoespecialidad: ['', [Validators.required]],
      medicos: ['', [Validators.required]]
    });
   }

  ngOnInit(): void {
    this.fechaActual();
    this.listarEspecialidades();
    //this.datos.fechaSelec = this.datosValoracion.campos;
    this.datosPaciente = this.datosValoracion.campos;
    console.log('DATOS DEL PACIENTE', this.datosPaciente);
    /*this.respuestaEspecialidades = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );*/
  }

  fechaActual(){
    const params_fecha = {
    };
    this.emergenciasService.listarFechaActual(params_fecha).subscribe(res => {
      this.responde = res.success.data;
      this.respuestaFechaActual = this.responde[0].sp_obt_fecha_actual; 
      console.log('RESPUESTA FECHA', this.respuestaFechaActual);
      this.datos.fechaSelec = this.respuestaFechaActual;
    });
  }

  formDatosPaciente = this.fb.group({
    especialidad: [''],
    medico: [''],
    fechaSelec: [''],
    hora: [''],
  }); 


  onSubmitPaciente() {
    const body = this.formDatosPaciente.value;
    console.log(body);
  }
  /*private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }*/

  listarEspecialidades() {
    const params_listar = {
      hspid: this.CODIGO_HOSPITAL
    };
    this.emergenciasService.listarEspecialidades(params_listar).subscribe(res => {
      this.responde = res.success.data;
      this.respuestaEspecialidades = this.responde; 
      console.log('RESPUESTA ESPECIALIDADES', this.respuestaEspecialidades);
    });
  }

  listarMedicos(value: any) {
    console.log('ID MEDICO', value);
    const params_medico = {
      idesp: value,
      hspid: this.CODIGO_HOSPITAL,
      fecha: this.datos.fechaSelec
    };
    this.emergenciasService.listarMedicos(params_medico).subscribe(res => {
      this.responde = res.success.data;
      this.respuestaMedicos = this.responde; 
      console.log('RESPUESTA ESPECIALIDADES', this.respuestaMedicos);
    });
  }

  seleccionar_fecha(event: MatDatepickerInputEvent<Date>) {
    console.log(event);
    const fechaCadena = JSON.stringify(event.value);
    const fecha = fechaCadena.substring(1, 11);
    console.log('fecha', fecha);
    //this.fecha = fecha;
    this.datos.fechaSelec = fecha;
    //this.onChange();
  }

  convHora(hora: any){
    console.log(hora);
    this.selecHora = hora.getHours() + ':' + hora.getMinutes();
    console.log(this.selecHora);
    let horaFin = this.selecHora.split(':');
    this.datos.hora = new Date(0, 0, 0, horaFin[0],horaFin[1]);
    //this.datos.hora = selecHora;
  }

  derivarPaciente(){
    console.log('DATOS', this.datos);
    this.nuevaHora = this.datos.hora.getHours() + ':' + this.datos.hora.getMinutes();
    console.log('this.nuevaHora', this.nuevaHora);

    const params_derivacion = {
      idpres: this.datosPaciente.prsid,
      usuario: this.datosPaciente.dtspslid,
      idmed: this.ID_USUARIO,
      idesp: this.datos.especialidad,
      idusr: this.datos.medico,
      hora: this.nuevaHora,
      fecha: this.datos.fechaSelec,
      hspid: this.CODIGO_HOSPITAL
    };
    this.emergenciasService.DerivarEspecialidad(params_derivacion).subscribe(res => {
      this.responde = res.success.data;
      this.respuestaDerivacion = this.responde; 
      console.log('RESPUESTA ESPECIALIDADES', this.respuestaDerivacion);
    });
  }

  imprimir(){
    if (this.datosPaciente.pressexo == 'FEMENINO') {
      this.mujer = 'x';
    } else {
      this.varon = 'x';
    }

    for (let index = 0; index < this.respuestaEspecialidades.length; index++) {
      const element = this.respuestaEspecialidades[index];
      if (element.espid == this.datos.especialidad) {
        console.log(element.espdescripcion);
        this.nombreEspecialidad = element.espdescripcion;
      } 
    }


    const pdfDefinition: any = {
      content: [
        {
          text: ' ',
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
                text: '\n SOLICITUD DE INTERCONSULTA',
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
            widths: ['*', 60, 40],
            body: [
              [
                {border: [false, false, false, false], text: ''},  
                {
                  border: [false, false, false, false],
                  text: 'Nª de E.C. :',
                  style: 'tableHeader'
                },
                {
                  text: this.datosPaciente.vhcl_codigoseg,
                  style: 'text'
                }, 
              ]
              
            ]
          }
        },
        '\n',
        {
          style: 'tableExample',
          table: {
            widths: ['*',100,'*',90,20,20,20,20],
            body: [
              [
                {text: 'Paciente:', style: 'tableHeader'},
                {text: this.datosPaciente.vpaciente, style: 'text'}, 
                {text: 'Edad:', style: 'tableHeader'},
                {text: this.datosPaciente.edad, style: 'text'},
                {text: 'F:', style: 'tableHeader'}, 
                {text: this.mujer, style: 'text'}, 
                {text: 'M:', style: 'tableHeader'},
                {text: this.varon, style: 'text'},
              ]
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*',100,'*',90,50,50],
            body: [
              [
                {text: 'Servicio:', style: 'tableHeader'},
                {text: this.datosPaciente.vtconsulta, style: 'text'}, 
                {text: 'Sala:', style: 'tableHeader'},
                {text: '', style: 'text'},
                {text: 'Cama:', style: 'tableHeader'}, 
                {text: '', style: 'text'},
              ]
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*','*',180],
            body: [
              [
                {rowSpan: 7, colSpan: 2, text: ''},
                {text: ''},
                {rowSpan: 7, text: ''},
              ],
              [
                {text: ''},
                {text: ''},
                {text: ''},
              ],
              [
                {text: ''},
                {text: ''},
                {text: ''},
              ],
              [
                {text: ''},
                {text: ''},
                {text: ''},
              ],
              [
                {text: ''},
                {text: ''},
                {text: ''},
              ],
              [
                {text: ''},
                {text: ''},
                {text: ''},
              ],
              [
                {text: ''},
                {text: ''},
                {text: ''},
              ],
              [
                {text: 'Servicio Interconsultante:', style: 'tableHeader'},
                {text: 'ESPRELLA DIAZ ROCIO', style: 'text'},
                {text: 'Firma y Sello del Médico', style: 'text', fontSize: 6},
              ]
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*',340],
            body: [
              [
                {text: 'Especialidad Solicitada:', style: 'tableHeader'},
                {text: this.nombreEspecialidad, style: 'text'},
              ]
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*','*','*','*'],
            body: [
              [
                {text: 'Fecha de la Solicitud:', style: 'tableHeader'},
                {text: this.datos.fechaSelec , style: 'text'}, 
                {text: 'Hora de la Solicitud:', style: 'tableHeader'},
                {text: this.nuevaHora , style: 'text'},
              ]
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*','*','*','*'],
            body: [
              [
                {text: 'Fecha de la Recepción:', style: 'tableHeader'},
                {text: '', style: 'text'}, 
                {text: 'Hora de la Recepción:', style: 'tableHeader'},
                {text: '', style: 'text'},
              ]
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*'],
            body: [
              [
                {rowSpan: 3, text: 'MOTIVO DE INTERCONSULTA:', style: 'tableHeader'},
              ],
              [
                {text: '', style: 'text'},
              ],
              [
                {},
              ]
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*'],
            body: [
              [
                {rowSpan: 3, text: 'DIAGNÓSTICO DE INTERCONSULTA:', style: 'tableHeader'},
              ],
              [
                {text: '', style: 'text'},
              ],
              [
                {},
              ]
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*','*',20,'*',20,'*',20,'*',20],
            body: [
              [
                {text: 'Tipo de Interconsulta:', style: 'tableHeader'}, 
                {text: 'De rutina:', style: 'tableHeader'},
                {text: '', style: 'text'},
                {text: 'En el dia:', style: 'tableHeader'}, 
                {text: '', style: 'text'}, 
                {text: 'Urgente:', style: 'tableHeader'},
                {text: 'X', style: 'text'},
                {text: 'Muy Urgente:', style: 'tableHeader'},
                {text: '', style: 'text'},
              ]
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*'],
            body: [
              [
                {rowSpan: 15, text: 'Firma y sello de Médico que efectuó la interconsulta:', style: 'tableHeader'},
              ],
              [
                {},
              ],
              [
                {},
              ],
              [
                {},
              ],
              [
                {},
              ],
              [
                {},
              ],
              [
                {},
              ],
              [
                {},
              ],
              [
                {},
              ],
              [
                {},
              ],
              [
                {},
              ],
              [
                {},
              ],
              [
                {},
              ],
              [
                {},
              ],
              [
                {},
              ]
            ]
          }
        },
        {
          style: 'tableExample',
          table: {
            widths: ['*','*','*','*'],
            body: [
              [
                {text: 'Fecha:', style: 'tableHeader'},
                {text: this.datos.fechaSelec, style: 'text'},
                {text: 'Hora:', style: 'tableHeader'},
                {text: this.nuevaHora, style: 'text'},
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
          color: '#444'
        },
        tableHeader:{
          fontSize: 9,
          alignment: 'left',
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
    };
    const pdf = pdfMake.createPdf(pdfDefinition);
    pdf.open();
  }

  cerrar(){
    console.log('CERRAR MODAL');
    this.dialogRef.close();
  }

}
