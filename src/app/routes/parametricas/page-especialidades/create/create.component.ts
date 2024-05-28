import {
  Component,
  OnInit,
  NgZone
} from '@angular/core';
import {
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  ParametricasService
} from '../../parametricas.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  sql: any;
  responde: any;

  correlativo: any;

  newForm = this.fb.group({
      esp_cod_especialidad: [''],
      esp_precio_reconsulta: [''],
      esp_precio: [''],
      esp_desc_especialidad: [''],
  });
  users: any[] = [];

  constructor(
      public fb: FormBuilder,
      public parametricasService: ParametricasService,
      public dialogRef: MatDialogRef < CreateComponent > ,
  ) {}

  ngOnInit(): void {}

  onSubmit() {
      this.sql = {
        consulta: "select * from primer_nivel.sp_inserter_especialidad_primer_nivel($$"+this.newForm.value.esp_cod_especialidad+"$$,$$"+this.newForm.value.esp_desc_especialidad+"$$,"+this.CODIGO_HOSPITAL+",1,$$"+this.newForm.value.esp_precio+"$$,$$"+this.newForm.value.esp_precio_reconsulta+"$$,$$20$$)"
      };
      this.parametricasService.dinamico(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        console.log("aaaaaaaaaaaaaaaaa",this.responde);
        this.dialogRef.close('true');
      });
  }

}
