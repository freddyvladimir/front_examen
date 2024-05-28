import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HemodialisisService } from '../../hemodialisis.service';
import { values } from 'lodash';
import { MatTableDataSource } from '@angular/material/table';
export interface DialogData {
  campos: any;
}
export interface Parametrica {
  parid: number;
  descrip: string;
}
@Component({
  selector: 'app-dialog-nueva-maquina',
  templateUrl: './dialog-nueva-maquina.component.html',
  styleUrls: ['./dialog-nueva-maquina.component.scss']
})
export class DialogNuevaMaquinaComponent implements OnInit, AfterViewInit {
  CODIGO_HOSPITAL = 5;
  variable_opcion: string = "";
  body: any = {};
  datos: any = [];
  newForm: FormGroup;
  dataFormulario: any = {};
  datos_parametricas: Parametrica[] = [];
  //////////servicios/////////
  sql: any;
  responde: any;
  dataSource : any;
  //////////servicios/////////
  fileToUpload: any = null;
  aux: any;
  test: any;
  idCombo: any;
  idhosp = 5;
  variable_combo: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    hospital: string
    // servicio: number,
    codigo_maquina: string,
    descripcion_maquina: string,
    asigid: number,
    opcion_estado: string,
    idservicio: number,
    maqIDsss: number,
    ParametroIDsss: number,
  },
    private http: HemodialisisService,
    private fb: FormBuilder,
    private serviciosComplementarios: HemodialisisService,
    private dialogRef: MatDialogRef<DialogNuevaMaquinaComponent>,
  ) {
    
    this.aux = data;
    this.newForm = this.fb.group({
      hospital: [''],
      servicio: [''],
      codigo: [this.aux.maqid, Validators.required],
      descripcion: [''],
    })
  }
  ngAfterViewInit(): void {
    this.newForm.controls["hospital"].setValue(this.CODIGO_HOSPITAL);
    this.newForm.controls["codigo"].setValue(this.aux.maqdatos[0].maq_codigo);
    this.newForm.controls["descripcion"].setValue(this.aux.maqdatos[0].maq_descripcion);
  }
  lista_parametro() {
    this.http.lst_parametricas().subscribe(res => {
      var response_buscar = res;
      this.dataSource = new MatTableDataSource(response_buscar.success.data);
      this.ngAfterViewInit();
    })
  }
  ngOnInit(): void {
   // console.log("asdasdas FORM", this.newForm.value);
   // console.log("asdasdas AUX", this.aux);
   // console.log("asdasdas", this.data);
   // console.log("asdasdas", this.aux.dataSource);
    this.lista_parametro();
    this.combo();
    if (this.aux.opcion_estado == "crear") {
      this.variable_opcion = "I";
      this.aux.maqid = 0;
    }
    if (this.data.opcion_estado == "editar") {
      this.variable_opcion = "U";
    }
  }
  combo() {
    this.serviciosComplementarios.lst_parametricas().subscribe(res => {
      this.variable_combo = res.success.data;
    })
  }
  onSubmit(parametros: any) {
    //console.log("Mostrando la Variable NEW FORM DESPUES DEL CLICK", this.newForm.value);
    //console.log("VALOR DEL COMBO", this.idCombo);

    let xxx = {
      "_maq_id": this.aux.maqid,
      "_cen_id": this.CODIGO_HOSPITAL,
      "_par_id": this.idCombo,
      "_maq_data": [
        {
          "maq_codigo": this.newForm.value.codigo,
          "maq_descripcion": this.newForm.value.descripcion,
        }
      ],
      "opcion": this.variable_opcion,
    }
    //console.log("Mostrando el contenido de LET despues del cambio o creacion --->", xxx);
    this.serviciosComplementarios.lst_abm(xxx).subscribe(resp => {
      this.dialogRef.close('true');
    });
  }
  valueCombo(dato: any) {
    this.idCombo = dato;
    // console.log("VALOR DE COMBO :", dato);
  }
}
