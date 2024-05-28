import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AdmisionesService } from '../admisiones.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';

export interface programaData {
}

@Component({
  selector: 'app-page-duplicados',
  templateUrl: './page-duplicados.component.html',
  styleUrls: ['./page-duplicados.component.scss']
})

export class PageDuplicadosComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  displayedColumns: string[] = [
    'id',
    'siis',
    'sice',
    'nombre',
    'paterno',
    'materno',
    'fecha_nacimiento',
    'tipo_paciente',
    'estado',
    'opcion'
  ];

  codigo: string = "";
  opcionSiisSice: any;
  dataSource: MatTableDataSource<programaData>;

  listDuplicados: any;
  constructor(private toastr: ToastrService, private admisionesService: AdmisionesService, private matSnackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource()
  }

  ngOnInit(): void {
  }

  searchDuplicados() {
    console.log(this.codigo);
    console.log(this.opcionSiisSice);
    if (this.opcionSiisSice == "siis") {
      this.getDuplicadosSIIS(this.codigo);
    }
    else {
      this.getDuplicadosSICE(this.codigo);
    }
  }

  getDuplicadosSICE(codigo: any) {
    let sql = {
      consulta: 'SELECT * FROM _bp_datos_personales INNER JOIN _hsp_historial_clinico ON dtspsl_id = hcl_dtspsl_id WHERE hcl_codigoseg = $$' + codigo + '$$ AND hcl_hsp_id = '+this.CODIGO_HOSPITAL+' ORDER BY hcl_id ASC'
    };
    this.admisionesService.dinamico(sql).subscribe(res => {
      this.dataSource = new MatTableDataSource(res.success.data[0].sp_dinamico);
    });
  }

  getDuplicadosSIIS(codigo: any) {
    let sql = {
      consulta: 'SELECT * FROM _bp_datos_personales INNER JOIN _hsp_historial_clinico ON dtspsl_id = hcl_dtspsl_id WHERE hcl_dtspsl_id = $$' + codigo + '$$ AND hcl_hsp_id = '+this.CODIGO_HOSPITAL+' ORDER BY hcl_id ASC'
    };

    this.admisionesService.dinamico(sql).subscribe(res => {
      this.dataSource = new MatTableDataSource(res.success.data[0].sp_dinamico);
    });
  }

  altasBajas(row: any) {
    console.log(row);
    if (row.hcl_estado == "A") {
      this.baja(row.hcl_id);
    }
    else {
      this.alta(row.hcl_id);
    }
  }

  alta(idPaciente: any) {
    var params = {
      "id_pac": idPaciente
    }
    this.admisionesService.alta(params).subscribe(res => {
      this.matSnackBar.open('Registro de paciente dado de alta', 'ok', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000,
        panelClass: ['style-success'],
      });
      this.searchDuplicados();
    });
  }

  baja(idPaciente: any) {
    var params = {
      "id_pac": idPaciente
    }
    this.admisionesService.baja(params).subscribe(res => {
      this.matSnackBar.open('Registro de paciente dado de baja', 'ok', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000,
        panelClass: ['style-success'],
      });
      this.searchDuplicados();
    });
  }
}
