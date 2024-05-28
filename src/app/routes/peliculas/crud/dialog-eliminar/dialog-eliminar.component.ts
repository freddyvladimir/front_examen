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
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { PeliculasService } from '../../peliculas.service';

@Component({
  selector: 'app-dialog-eliminar',
  templateUrl: './dialog-eliminar.component.html',
  styleUrls: ['./dialog-eliminar.component.scss']
})
export class DialogEliminarComponent implements OnInit {


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      _id: number
    },
    private fb: FormBuilder,
    public http: PeliculasService,
    public dialogRef: MatDialogRef<DialogEliminarComponent>,) { }

  ngOnInit(): void { }

  onSubmitDelete() {
    console.log("000000", this.data);

    this.http.deletepeliculas(this.data._id).subscribe(resp => {
      this.dialogRef.close('true');
    });
  }

}
