import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';

import * as _ from 'lodash';

@Component({
  selector: 'app-dialog-evolucion-ordenes-medicas',
  templateUrl: './dialog-evolucion-ordenes-medicas.component.html',
  styleUrls: ['./dialog-evolucion-ordenes-medicas.component.scss']
})
export class DialogEvolucionOrdenesMedicasComponent implements OnInit {

  public contextAddEdit: string = "add";
  public horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  public verticalPosition: MatSnackBarVerticalPosition = 'top';

  tipoBock=false;
  constructor(
    public dialogRef: MatDialogRef<DialogEvolucionOrdenesMedicasComponent>,
    public formBuilder: FormBuilder,
    public matSnackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  evolucionClinicaForm = this.formBuilder.group({
    fecha1: [''],
    hora1: [''],
    notasEvolucion: ['']
  });

  ngOnInit(): void {
    console.log("DIALOg DATA");
    console.log(this.data);

    if (this.data != null) {
      this.contextAddEdit = "edit";
      console.log("lodash OMIT");
      this.evolucionClinicaForm.setValue(_.omit(this.data, []));
    }
  }

  submit() {
    console.log("On submit");
    console.log(this.data);
    console.log("this.evolucionClinicaForm");
    console.log(this.evolucionClinicaForm);

    if (this.evolucionClinicaForm.valid) {
      console.log(this.evolucionClinicaForm.value);
     
      if (this.contextAddEdit == "add") {
      }
      else {
        if (this.contextAddEdit == "edit") {
        }
      }
    }
    else {
      console.log("NOT VALID");
    }    
  }
  close() {
    this.dialogRef.close();
  }

}
