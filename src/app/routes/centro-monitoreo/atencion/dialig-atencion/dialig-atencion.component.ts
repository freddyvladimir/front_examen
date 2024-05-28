import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  campos: any;
}

@Component({
  selector: 'app-dialig-atencion',
  templateUrl: './dialig-atencion.component.html',
  styleUrls: ['./dialig-atencion.component.scss']
})
export class DialigAtencionComponent implements OnInit {  
  hospitalSeleccionado:any;
  constructor(
    public dialogRef: MatDialogRef<DialigAtencionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
    this.hospitalSeleccionado = this.data;
  }

  cerrarModal(){
    this.dialogRef.close();
  }

}
