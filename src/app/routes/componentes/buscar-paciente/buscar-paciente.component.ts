import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComponentesService } from '../componentes.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-buscar-paciente',
  templateUrl: './buscar-paciente.component.html',
  styleUrls: ['./buscar-paciente.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class BuscarPacienteComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<PeriodicElement>;
  //columnsToDisplay = ['hcl_codigoseg', 'dtspsl_ci', 'dtspsl_paterno', 'dtspsl_materno', 'dtspsl_nombres', 'dtspsl_fec_nacimiento'];
  columnsToDisplay = ['HC', 'CI', 'PATERNO', 'MATERNO', 'NOMBRES', 'FECHA_NACIMIENTO'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement?: PeriodicElement | null;

  navStyle = 'background: #09b8b0;color:#fefeff;';
  vci = '';
  vappaterno = '';
  vcodigoseg = '';
  vapmaterno = '';
  vnombre = '';

  sql: any;
  responde: any;
  @Output() newListEvent = new EventEmitter<any>();  
  @Output() newPacienteEvent = new EventEmitter<any>();  

  pacienteForm!: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  cantidad: Boolean = false;
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  constructor(private formBuilder: FormBuilder, private http: ComponentesService) {
    //const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));
    this.dataSource = new MatTableDataSource();
  }
  submitted = false;
  ngOnInit(): void {
    this.pacienteForm = this.formBuilder.group({
      vci: [''],
      vappaterno: [''],
      vapmaterno: [''],
      vnombre: [''],
      vcodigoseg: [''],
      vidhospital: [this.CODIGO_HOSPITAL],
    });

    //this.dataSource = [{"position":1,"name":"Hydrogen","weight":1.0079,"symbol":"H","description":"Hydrogen is a chemical element with symbol H and atomic number 1. With a standard\n            atomic weight of 1.008, hydrogen is the lightest element on the periodic table."},{"position":2,"name":"Helium","weight":4.0026,"symbol":"He","description":"elium is a chemical element with symbol He and atomic number 2. It is a\n            colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas\n            group in the periodic table. Its boiling point is the lowest among all the elements."},{"position":1,"name":"Hydrogen","weight":1.0079,"symbol":"H","description":"Hydrogen is a chemical element with symbol H and atomic number 1. With a standard\n            atomic weight of 1.008, hydrogen is the lightest element on the periodic table."},{"position":2,"name":"Helium","weight":4.0026,"symbol":"He","description":"elium is a chemical element with symbol He and atomic number 2. It is a\n            colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas\n            group in the periodic table. Its boiling point is the lowest among all the elements."},{"position":1,"name":"Hydrogen","weight":1.0079,"symbol":"H","description":"Hydrogen is a chemical element with symbol H and atomic number 1. With a standard\n            atomic weight of 1.008, hydrogen is the lightest element on the periodic table."},{"position":2,"name":"Helium","weight":4.0026,"symbol":"He","description":"elium is a chemical element with symbol He and atomic number 2. It is a\n            colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas\n            group in the periodic table. Its boiling point is the lowest among all the elements."},{"position":1,"name":"Hydrogen","weight":1.0079,"symbol":"H","description":"Hydrogen is a chemical element with symbol H and atomic number 1. With a standard\n            atomic weight of 1.008, hydrogen is the lightest element on the periodic table."},{"position":2,"name":"Helium","weight":4.0026,"symbol":"He","description":"elium is a chemical element with symbol He and atomic number 2. It is a\n            colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas\n            group in the periodic table. Its boiling point is the lowest among all the elements."},{"position":1,"name":"Hydrogen","weight":1.0079,"symbol":"H","description":"Hydrogen is a chemical element with symbol H and atomic number 1. With a standard\n            atomic weight of 1.008, hydrogen is the lightest element on the periodic table."},{"position":2,"name":"Helium","weight":4.0026,"symbol":"He","description":"elium is a chemical element with symbol He and atomic number 2. It is a\n            colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas\n            group in the periodic table. Its boiling point is the lowest among all the elements."},{"position":1,"name":"Hydrogen","weight":1.0079,"symbol":"H","description":"Hydrogen is a chemical element with symbol H and atomic number 1. With a standard\n            atomic weight of 1.008, hydrogen is the lightest element on the periodic table."},{"position":2,"name":"Helium","weight":4.0026,"symbol":"He","description":"elium is a chemical element with symbol He and atomic number 2. It is a\n            colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas\n            group in the periodic table. Its boiling point is the lowest among all the elements."},{"position":1,"name":"Hydrogen","weight":1.0079,"symbol":"H","description":"Hydrogen is a chemical element with symbol H and atomic number 1. With a standard\n            atomic weight of 1.008, hydrogen is the lightest element on the periodic table."},{"position":2,"name":"Helium","weight":4.0026,"symbol":"He","description":"elium is a chemical element with symbol He and atomic number 2. It is a\n            colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas\n            group in the periodic table. Its boiling point is the lowest among all the elements."},{"position":1,"name":"Hydrogen","weight":1.0079,"symbol":"H","description":"Hydrogen is a chemical element with symbol H and atomic number 1. With a standard\n            atomic weight of 1.008, hydrogen is the lightest element on the periodic table."},{"position":2,"name":"Helium","weight":4.0026,"symbol":"He","description":"elium is a chemical element with symbol He and atomic number 2. It is a\n            colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas\n            group in the periodic table. Its boiling point is the lowest among all the elements."}];

    //let dataSour = [{"position":1,"name":"Hydrogen","weight":1.0079,"symbol":"H","description":"Hydrogen is a chemical element with symbol H and atomic number 1. With a standard\n            atomic weight of 1.008, hydrogen is the lightest element on the periodic table."},{"position":2,"name":"Helium","weight":4.0026,"symbol":"He","description":"elium is a chemical element with symbol He and atomic number 2. It is a\n            colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas\n            group in the periodic table. Its boiling point is the lowest among all the elements."},{"position":1,"name":"Hydrogen","weight":1.0079,"symbol":"H","description":"Hydrogen is a chemical element with symbol H and atomic number 1. With a standard\n            atomic weight of 1.008, hydrogen is the lightest element on the periodic table."},{"position":2,"name":"Helium","weight":4.0026,"symbol":"He","description":"elium is a chemical element with symbol He and atomic number 2. It is a\n            colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas\n            group in the periodic table. Its boiling point is the lowest among all the elements."},{"position":1,"name":"Hydrogen","weight":1.0079,"symbol":"H","description":"Hydrogen is a chemical element with symbol H and atomic number 1. With a standard\n            atomic weight of 1.008, hydrogen is the lightest element on the periodic table."},{"position":2,"name":"Helium","weight":4.0026,"symbol":"He","description":"elium is a chemical element with symbol He and atomic number 2. It is a\n            colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas\n            group in the periodic table. Its boiling point is the lowest among all the elements."},{"position":1,"name":"Hydrogen","weight":1.0079,"symbol":"H","description":"Hydrogen is a chemical element with symbol H and atomic number 1. With a standard\n            atomic weight of 1.008, hydrogen is the lightest element on the periodic table."},{"position":2,"name":"Helium","weight":4.0026,"symbol":"He","description":"elium is a chemical element with symbol He and atomic number 2. It is a\n            colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas\n            group in the periodic table. Its boiling point is the lowest among all the elements."},{"position":1,"name":"Hydrogen","weight":1.0079,"symbol":"H","description":"Hydrogen is a chemical element with symbol H and atomic number 1. With a standard\n            atomic weight of 1.008, hydrogen is the lightest element on the periodic table."},{"position":2,"name":"Helium","weight":4.0026,"symbol":"He","description":"elium is a chemical element with symbol He and atomic number 2. It is a\n            colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas\n            group in the periodic table. Its boiling point is the lowest among all the elements."},{"position":1,"name":"Hydrogen","weight":1.0079,"symbol":"H","description":"Hydrogen is a chemical element with symbol H and atomic number 1. With a standard\n            atomic weight of 1.008, hydrogen is the lightest element on the periodic table."},{"position":2,"name":"Helium","weight":4.0026,"symbol":"He","description":"elium is a chemical element with symbol He and atomic number 2. It is a\n            colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas\n            group in the periodic table. Its boiling point is the lowest among all the elements."},{"position":1,"name":"Hydrogen","weight":1.0079,"symbol":"H","description":"Hydrogen is a chemical element with symbol H and atomic number 1. With a standard\n            atomic weight of 1.008, hydrogen is the lightest element on the periodic table."},{"position":2,"name":"Helium","weight":4.0026,"symbol":"He","description":"elium is a chemical element with symbol He and atomic number 2. It is a\n            colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas\n            group in the periodic table. Its boiling point is the lowest among all the elements."},{"position":1,"name":"Hydrogen","weight":1.0079,"symbol":"H","description":"Hydrogen is a chemical element with symbol H and atomic number 1. With a standard\n            atomic weight of 1.008, hydrogen is the lightest element on the periodic table."},{"position":2,"name":"Helium","weight":4.0026,"symbol":"He","description":"elium is a chemical element with symbol He and atomic number 2. It is a\n            colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas\n            group in the periodic table. Its boiling point is the lowest among all the elements."}];
    //this.dataSource = new MatTableDataSource(dataSour);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSubmit() {
    this.submitted = true;
  }

  searchPaciente() {
    var params = this.pacienteForm.value;
    params['vidhospital'] = this.CODIGO_HOSPITAL;
    console.table(params);
    this.http.buscarPacienteReprogramacionNuevo(params).subscribe(res => {
      var response = res;
      this.newListEvent.emit(response);
    });

  }
  
  buscarCodigoSice(codigo: any) {
    console.log("codigo", codigo);
    try {
      this.sql = {
        v_codigo: codigo
      };
      this.http.buscarCodigoSice(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        console.log("this.responde", this.responde);
        if (this.responde.success.code == 200) {
          let data = this.responde.success.data;
          for (let x = 0; x < data.length; x++) {
            data[x].HC = data[x].hcl_codigoseg;
            data[x].CI = data[x].dtspsl_ci;
            data[x].PATERNO = data[x].dtspsl_paterno;
            data[x].MATERNO = data[x].dtspsl_materno;
            data[x].NOMBRES = data[x].dtspsl_nombres;
            data[x].FECHA_NACIMIENTO = data[x].dtspsl_fec_nacimiento;
          }
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.cantidad = true;
        } else {
          this.cantidad = false;
          this.dataSource = new MatTableDataSource();
        }
      });
    } catch (error) {
    }
  }

  buscarSice() {
    try {
      this.sql = {
        i_HCL_NUMCI: this.vci,
        i_HCL_APPAT: this.vappaterno,
        i_HCL_APMAT: this.vapmaterno,
        i_HCL_NOMBRE: this.vnombre,
      };
      this.http.buscarSice(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        console.log("this.responde", this.responde);
        if (this.responde.success.code == 200) {
          let data = this.responde.success.data;
          for (let x = 0; x < data.length; x++) {
            data[x].HC = data[x].hcl_codigoseg;
            data[x].CI = data[x].dtspsl_ci;
            data[x].PATERNO = data[x].dtspsl_paterno;
            data[x].MATERNO = data[x].dtspsl_materno;
            data[x].NOMBRES = data[x].dtspsl_nombres;
            data[x].FECHA_NACIMIENTO = data[x].dtspsl_fec_nacimiento;
          }
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.cantidad = true;
        } else {
          this.cantidad = false;
          this.dataSource = new MatTableDataSource();
        }
      });
    } catch (error) {
    }
  }

  limpiar() {
    this.vci = '';
    this.vappaterno = '';
    this.vcodigoseg = '';
    this.vapmaterno = '';
    this.vnombre = '';
    this.dataSource = new MatTableDataSource();
    this.cantidad = false;
  }

  seleccionarPaciente(data: any) {
    this.newListEvent.emit(data);
    this.cantidad = false;
  }

  nuevoPaciente() {
    this.newPacienteEvent.emit();
    this.cantidad = false;
  }
}

export interface PeriodicElement {
  HC: string;
  CI: string;
  PATERNO: string;
  MATERNO: string;
  NOMBRES: string;
  FECHA_NACIMIENTO: string;
}
