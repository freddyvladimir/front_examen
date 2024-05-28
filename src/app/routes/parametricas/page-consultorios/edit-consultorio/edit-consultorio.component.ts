
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
  selector: 'app-edit-consultorio',
  templateUrl: './edit-consultorio.component.html',
  styleUrls: ['./edit-consultorio.component.scss']
})
export class EditConsultorioComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  prestaciones: any;
  userEditForm = this.fb.group({
      cnsl_descripcion: [this.data.descripcion, Validators.required],
      cnsl_tipo: [this.data.tipo, Validators.required],
      cnsl_codigo: [this.data.codigo, Validators.required],
      cnsl_cp_id: [this.data.cuaderno, Validators.required],
      cnsl_id: [this.data.id],
  });

  users: any[] = [];

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: {
          hospital: number,
          descripcion: string,
          tipo: string,
          codigo: string,
          cuaderno: number,
          id: number
      },
      private fb: FormBuilder,
      public parametricasService: ParametricasService,
      public dialogRef: MatDialogRef < EditConsultorioComponent > , ) {}

  ngOnInit(): void {
      const body = {
          "idhsp": this.CODIGO_HOSPITAL
      };
      this.parametricasService.postLstHspPrestaciones(body).subscribe(resp => {
          this.prestaciones = resp;
      })
  }

  onSubmitEdit() {
      const body = this.userEditForm.value;
      body.cnsl_id = this.data.id;
      this.parametricasService.putConsultorio(body).subscribe(resp => {
          this.dialogRef.close('true');
      });
  }

}
