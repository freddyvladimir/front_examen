import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DateRange, MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER } from '@angular/material/datepicker';
import { ToastrService } from 'ngx-toastr';
//import { ParametricasService } from '../../parametricas.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeliculasService } from '../../peliculas.service';

export interface DialogData {
  campos: any;
  tipo: any;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  providers: [MAT_RANGE_DATE_SELECTION_MODEL_PROVIDER]
})
export class DialogComponent implements OnInit {
  datosPelicula: any = [];
  constructor(public http: PeliculasService, public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    if (data.tipo == "UPDATE") {
      this.datosPelicula = data.campos;
    }
  }


  ngOnInit(): void {
  }

  guardarData() {
    console.log(this.datosPelicula);
    var campos = {
      "titulo": this.datosPelicula.titulo,
      "genero": this.datosPelicula.genero,
      "director": this.datosPelicula.director,
      "actores": this.datosPelicula.actores,
      "anio_lanzamiento": this.datosPelicula.anio_lanzamiento,
      "sinopsis": this.datosPelicula.sinopsis,
      "calificaciones": [{ "usuario_id": sessionStorage.getItem('usr'), "calificacion": 0 }]
    }
    this.http.crearDatos(campos).subscribe(resp => {
      console.log("-----", resp);
      this.dialogRef.close();
    });
  }

  actualizarData(){
    console.log(this.datosPelicula);
    var campos = {
      "titulo": this.datosPelicula.titulo,
      "genero": this.datosPelicula.genero,
      "director": this.datosPelicula.director,
      "actores": this.datosPelicula.actores,
      "anio_lanzamiento": this.datosPelicula.anio_lanzamiento,
      "sinopsis": this.datosPelicula.sinopsis,
      "_id":this.datosPelicula._id
      //"calificaciones": [{ "usuario_id": sessionStorage.getItem('usr'), "calificacion": 0 }]
    }
    this.http.actualizarDatos(campos).subscribe(resp => {
      console.log("-----", resp);
      this.dialogRef.close();
    });
  }

  close() {
    this.dialogRef.close();
  }

}
