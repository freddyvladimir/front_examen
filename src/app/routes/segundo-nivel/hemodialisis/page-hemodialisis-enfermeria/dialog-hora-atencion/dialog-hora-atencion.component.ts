import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
@Component({
  selector: 'app-dialog-hora-atencion',
  templateUrl: './dialog-hora-atencion.component.html',
  styleUrls: ['./dialog-hora-atencion.component.scss']
})
export class DialogHoraAtencionComponent implements OnInit {

  public contextAddEdit: string = "add";
  public horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  public verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    public dialogRef: MatDialogRef<DialogHoraAtencionComponent>,
    public formBuilder: FormBuilder,
    public matSnackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  horarioAtencionForm = this.formBuilder.group({
    enf_fr: [''],
    enf_fs: [''],
    enf_pa: [''],
    enf_qd: [''],
    enf_fc: [''],
    enf_obs: [''],
    enf_ptm: [''],
    enf_sat: [''],
    enf_hora: [''],
    enf_temp: [''],
    enf_condu: [''],
    enf_pvenosa: ['']
  });

  ngOnInit(): void {
    console.log("DIALOg DATA");
    console.log(this.data);

    if (this.data != null) {
      this.contextAddEdit = "edit";
      console.log("lodash OMIT");      
    }
  }

  submit() {
    console.log("On submit");
    console.log(this.data);

    console.log("hora atencion");
    console.log(this.horarioAtencionForm);
  }

  guardarNuevaHora() {
    console.log(this.horarioAtencionForm.value);
    this.dialogRef.close(this.horarioAtencionForm.value);    
  }

}
