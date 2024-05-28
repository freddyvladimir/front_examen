import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AdmisionesService } from '../admisiones.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, } from '@angular/material/snack-bar';

export interface programaData {
}
@Component({
  selector: 'app-page-reprogramacion',
  templateUrl: './page-reprogramacion.component.html',
  styleUrls: ['./page-reprogramacion.component.scss']
})
export class PageReprogramacionComponent implements OnInit {

  displayedColumns: string[] = ['serial', 'ci', 'paterno', 'materno', 'nombres', 'sice', 'fn'];
  dataSource: MatTableDataSource<programaData>;

  constructor(private toastr: ToastrService, private admisionesService: AdmisionesService, private matSnackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource()
  }
  addList(value: any) {    
    this.dataSource=value.success.data;
  }
  ngOnInit(): void {
  }

  reprogramar(row: any) {
    console.log(row);
  }


}
