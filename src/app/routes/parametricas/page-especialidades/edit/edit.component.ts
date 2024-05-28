import {
  Component,
  OnInit,
  Inject
} from '@angular/core';
import {
  FormBuilder,
  Validators
} from '@angular/forms';
import {
  ParametricasService
} from '../../parametricas.service';
import {
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  userEditForm = this.fb.group({
      esp_cod_especialidad: [this.data.codigo, Validators.required],
      esp_desc_especialidad: [this.data.descripcion, Validators.required],
      esp_id_cuaderno: [this.data.cuaderno, Validators.required],
      esp_precio: [this.data.consulta, Validators.required],
      esp_precio_reconsulta: [this.data.reconsulta, Validators.required],
      esp_id: [this.data.id, Validators.required],
  });

  users: any[] = [];

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: {
          codigo: string,
          descripcion: string,
          cuaderno: number,
          consulta: string,
          reconsulta: string,
          id: number
      },
      private fb: FormBuilder,
      public parametricasService: ParametricasService,
      public dialogRef: MatDialogRef < EditComponent > , ) {}

  ngOnInit(): void {}

  onSubmitEdit() {
      const body = this.userEditForm.value;
      body.esp_id = this.data.id;
      this.parametricasService.putEspecialidad(body).subscribe(resp => {
          this.dialogRef.close('true');
      });
  }

}