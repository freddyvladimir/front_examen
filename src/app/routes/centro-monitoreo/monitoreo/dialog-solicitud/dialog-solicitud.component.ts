import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  campos: any;
}

@Component({
  selector: 'app-dialog-solicitud',
  templateUrl: './dialog-solicitud.component.html',
  styleUrls: ['./dialog-solicitud.component.scss']
})
export class DialogSolicitudComponent implements OnInit {
  hospitalSeleccionadoMonitoreo:any;
  constructor(
    public dialogRef: MatDialogRef<DialogSolicitudComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
    this.hospitalSeleccionadoMonitoreo = this.data;    
  }
  cerrarModal(){
    this.dialogRef.close();
  }

}
