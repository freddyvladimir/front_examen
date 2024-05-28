import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

export interface Especialidad {
}
@Component({
  selector: 'app-evolucion-ordenes-medicas',
  templateUrl: './evolucion-ordenes-medicas.component.html',
  styleUrls: ['./evolucion-ordenes-medicas.component.scss']
})

export class EvolucionOrdenesMedicasComponent implements OnInit {
  public dataSource = new MatTableDataSource<Especialidad>();
  displayedColumns: string[] = [
    'actions',
    'codigo',
    'descripcion',
    'cuaderno',
    'consulta',
    'reconsulta'
  ];
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  constructor(private formBuilder: FormBuilder) { }
  tipoBock = false;

  evolucionClinicaForm = this.formBuilder.group({
    fecha1: [''],
    hora1: [''],
    notasEvolucion: ['']
  });

  public swAccordionExpanded: boolean = true;

  ngOnInit(): void {
  }

  expandedAccordion() {
    if (this.swAccordionExpanded) {
      this.accordion.openAll();
    }
    else {
      this.accordion.closeAll();
    }
    this.swAccordionExpanded = !this.swAccordionExpanded;
  }

  ngAfterViewInit(): void {
    this.expandedAccordion();
  }

  getEvolucionOrdenesMedicas(params: any) {
    /*this.especialidadService.getAll(params).subscribe((data: any) => {
      console.log(data);
      this.dataSource = data;
    });*/
  }

  create() {
    //this.service.initializeFormGroup();
    /*const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(DialogEspecialidadComponent, dialogConfig);*/
  }

  delete(id: string) {
    //this.especialidadService.deleteOrder(id);
  }
  edit(especialidad:any) {
    console.log("........ ESPECIALIDAD ---------------");
    console.log(especialidad);
    /*const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.data = especialidad;
    this.dialog.open(DialogEspecialidadComponent, dialogConfig);*/
  }
}
