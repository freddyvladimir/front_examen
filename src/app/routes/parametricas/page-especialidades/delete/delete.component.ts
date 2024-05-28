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
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: {
          codigo: string,
          descripcion: string,
          id: number
      },
      private fb: FormBuilder,
      public parametricasService: ParametricasService,
      public dialogRef: MatDialogRef < DeleteComponent > , ) {}

  ngOnInit(): void {}

  onSubmitDelete() {
      this.parametricasService.deleteEspecialidad(this.data.id).subscribe(resp => {
          this.dialogRef.close('true');
      });
  }

}