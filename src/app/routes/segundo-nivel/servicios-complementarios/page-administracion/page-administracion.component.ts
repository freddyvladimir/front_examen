import { Component, OnInit } from '@angular/core';

//import { FichasComponent } from '../../../componentes/fichas/fichas.component';


export interface programaData {
}
@Component({
  selector: 'app-page-administracion',
  templateUrl: './page-administracion.component.html',
  styleUrls: ['./page-administracion.component.scss']
})

export class PageAdministracionComponent implements OnInit {
 
  constructor( 
    //private FichasComponent: FichasComponent
    ) {}

  ngOnInit(): void {}
  
}
