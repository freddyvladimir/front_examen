import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EmergenciasService } from '../../emergencias.service';
import { DialogDerivarEspecialidadComponent } from './dialog-derivar-especialidad/dialog-derivar-especialidad.component';
import { PageMedicoEmergenciasComponent } from '../../page-medico-emergencias/page-medico-emergencias.component';


@Component({
  selector: 'app-valoracion-especialidad',
  templateUrl: './valoracion-especialidad.component.html',
  styleUrls: ['./valoracion-especialidad.component.scss']
})
export class ValoracionEspecialidadComponent implements OnInit {

  /////////  VARIABLES  ///////////
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  //value = '';
  //paciente_seleccionado: any;
  
  data_respuesta: any;
  dataAtencion: any;
  /////////  VARIABLES  ///////////

  //////////servicios/////////
  sql: any;
  responde: any;
  result: any;
  //////////servicios/////////



  constructor(
    private toastr: ToastrService, 
    public dialog: MatDialog, 
    private emergenciasService: EmergenciasService,
    private var_pdf_data: PageMedicoEmergenciasComponent) 
  { 
    this.dataAtencion = var_pdf_data.var_pdf_data;
  }

  ngOnInit(): void {
    
    console.log('DATA DEL PACIENTE',this.dataAtencion);
  }





  valoracion(){
    const dialogRef = this.dialog.open(DialogDerivarEspecialidadComponent, {
      width: '1000px',
      data: { campos: this.dataAtencion },
    });dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.data_respuesta = result;
    });
  }

}
