import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Cie10Component } from 'app/routes/componentes/cie10/cie10.component';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

@Component({
  selector: 'app-render',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.scss']
})
export class RenderComponent implements OnInit {
  modal: any;
  superior: any = [];
  inferior: any = [];
  superior_menor: any = [];
  inferior_menor: any = [];
  tipo: any;
  tipo_seleccionado: any;
  tratamientos: any;
  campo: any;
  dataFormulario:any;

  @Input() formulario: any;
  constructor(private dialog: MatDialog) {
    this.tipo = "mayor";
    this.tratamientos = [
      { tipo: 'sano', descipcion: 'Sano' },
      { tipo: 'caries', descipcion: 'Caries' },
      { tipo: 'endodoncia', descipcion: 'Endodoncia' },
      { tipo: 'ausente', descipcion: 'Pieza Ausente' },
      { tipo: 'extraccion', descipcion: 'Extracción Indicada' },
      { tipo: 'coronada', descipcion: 'Pieza Coronada' },
      { tipo: 'implante', descipcion: 'Implante' },
      { tipo: 'lesion_cervical', descipcion: 'Lesión Cervical No Cariosa' },
      { tipo: 'diagnostico', descipcion: 'Diagnostico' }
    ];
    this.dataFormulario = [
      {
        "titulo": "FECHA DE NACIMIENTO",
        "campo": "fecha_nacimiento",
        "tipo": "TXTL",
        "estado": "true",
        "orden": "30",
        "colclass": "col-md-6",
        "valor": ""
      },
      {
        "titulo": "EDAD",
        "campo": "edad",
        "tipo": "TXTL",
        "estado": "true",
        "orden": "30",
        "colclass": "col-md-6",
        "valor": ""
      },
      {
        "titulo": "SIGNOS VITALES",
        "campo": "gsig_vit",
        "tipo": "SUBTIT",
        "estado": "LECTURA",
        "orden": "25",
        "colclass": "col-md-12",
        "valor": ""
      },
      {
        "titulo": "PESO (Kg).(g)",
        "campo": "peso",
        "tipo": "TXTL",
        "estado": "true",
        "orden": "30",
        "colclass": "col-md-4",
        "valor": ""
      },
      {
        "titulo": "ESTATURA (cm)",
        "campo": "talla",
        "tipo": "TXTL",
        "estado": "true",
        "orden": "40",
        "colclass": "col-md-4",
        "valor": ""
      },
      {
        "titulo": "TEMPERATURA C°",
        "campo": "temp",
        "tipo": "TXTL_TEMP",
        "estado": "true",
        "orden": "50",
        "colclass": "col-md-4",
        "valor": "",
        "tipos": [
          {
            "subtitulo": "Axilar",
            "sub_valor": ""
          },
          {
            "subtitulo": "Rectal",
            "sub_valor": ""
          },
          {
            "subtitulo": "Oral",
            "sub_valor": ""
          },
          {
            "subtitulo": "Auricular",
            "sub_valor": ""
          }
        ]
      },
      {
        "titulo": "FRECUENCIA CARDIACA (l/m)",
        "campo": "frec_card",
        "tipo": "TXTL",
        "posicion": "UP",
        "columnas": "1",
        "estado": "true",
        "orden": "60",
        "colclass": "col-md-4",
        "valor": "",
        "validacion": "frmRender.frec_card.$invalid"
      },
      {
        "titulo": "PRESION ARTERIAL (mmHg)",
        "campo": "pres_art",
        "tipo": "TXTL",
        "posicion": "UP",
        "columnas": "1",
        "estado": "ESCRITURA",
        "orden": "70",
        "colclass": "col-md-4",
        "valor": "",
        "validacion": "frmRender.pres_art.$invalid"
      },
      {
        "titulo": "FRECUENCIA RESPIRATORIA (r/m)",
        "campo": "frec_resp",
        "tipo": "TXTL",
        "posicion": "UP",
        "columnas": "1",
        "estado": "ESCRITURA",
        "orden": "80",
        "colclass": "col-md-4",
        "valor": "",
        "validacion": "frmRender.frec_resp.$invalid"
      },
      {
        "titulo": "SATURACION DE OXIGENO (o2) ",
        "campo": "sat_oxigeno",
        "tipo": "TXTL",
        "estado": "ESCRITURA",
        "orden": "80",
        "colclass": "col-md-4",
        "valor": "",
        "posicion": "UP",
        "columnas": "1",
        "validacion": "frmRender.frec_resp.$invalid"
      },
      {
        "titulo": "DIAGNOSTICOS",
        "campo": "gdiagnosticos",
        "tipo": "SUBTIT",
        "estado": "NECESARIO",
        "orden": "125",
        "colclass": "col-md-12",
        "valor": ""
      },
      {
        "titulo": "MOTIVO DE LA CONSULTA",
        "campo": "mot_cons",
        "tipo": "TAR",
        "estado": "NECESARIO",
        "orden": "130",
        "colclass": "col-md-6",
        "valor": "",
        "posicion": "UP",
        "columnas": "1",
        "validacion": "frmRender.motivo_consulta.$invalid"
      },
      {
        "titulo": "DIAGNOSTICOS CIE 10",
        "campo": "diag_cie10",
        "tipo": "TARMOD",
        "posicion": "UP",
        "columnas": "1",
        "estado": "ESCRITURA",
        "orden": "150",
        "colclass": "col-md-6",
        "valor": "",
        "validacion": "false"
      },
      {
        "titulo": "OBSERVACIONES",
        "campo": "observaciones",
        "tipo": "TAR",
        "estado": "NECESARIO",
        "orden": "130",
        "colclass": "col-md-6",
        "valor": "",
        "posicion": "UP",
        "columnas": "1",
        "validacion": "frmRender.obs.$invalid"
      },
      {
        "titulo": "Primera consulta",
        "campo": "prim_cnsl",
        "tipo": "CBO",
        "estado": "ESCRITURA",
        "orden": "60",
        "colclass": "col-md-6",
        "valor": "",
        "data": [
          {
            "valor": 0,
            "dato": "FALSO"
          },
          {
            "valor": 1,
            "dato": "VERDADERO"
          }
        ]
      },
      {
        "titulo": "Enbarazada o Postparto",
        "campo": "emb_postp",
        "tipo": "CBO",
        "estado": "ESCRITURA",
        "orden": "110",
        "colclass": "col-md-6",
        "valor": "",
        "data": [
          {
            "valor": "0",
            "dato": "Seleccione"
          },
          {
            "valor": "1",
            "dato": "Embarazada"
          },
          {
            "valor": "2",
            "dato": "Postparto"
          }
        ],
        "tipo_dato": "sql",
        "validacion": "frmRender.est_nutr.$invalid"
      },
      {
        "titulo": "ODONTOGRAMA",
        "campo": "odontograma",
        "tipo": "SUBTIT",
        "estado": "LECTURA",
        "orden": "25",
        "colclass": "col-md-12",
        "valor": ""
      }
    ];
    //this.formularios();
  }

  formularios():void{
    this.dataFormulario = [
      {
        "titulo": "FECHA DE NACIMIENTO",
        "campo": "fecha_nacimiento",
        "tipo": "TXTL",
        "estado": "true",
        "orden": "30",
        "colclass": "col-md-6",
        "valor": ""
      },
      {
        "titulo": "EDAD",
        "campo": "edad",
        "tipo": "TXTL",
        "estado": "true",
        "orden": "30",
        "colclass": "col-md-6",
        "valor": ""
      },
      {
        "titulo": "SIGNOS VITALES",
        "campo": "gsig_vit",
        "tipo": "SUBTIT",
        "estado": "LECTURA",
        "orden": "25",
        "colclass": "col-md-12",
        "valor": "1"
      },
      {
        "titulo": "PESO",
        "campo": "peso",
        "tipo": "TXTL",
        "estado": "true",
        "orden": "30",
        "colclass": "col-md-4",
        "valor": ""
      },
      {
        "titulo": "TALLA",
        "campo": "talla",
        "tipo": "TXTL",
        "estado": "true",
        "orden": "40",
        "colclass": "col-md-4",
        "valor": ""
      },
      {
        "titulo": "TEMPERATURA C°",
        "campo": "temp",
        "tipo": "TXTL_TEMP",
        "estado": "true",
        "orden": "50",
        "colclass": "col-md-4",
        "valor": "",
        "tipos": [
          {
            "subtitulo": "Axilar",
            "sub_valor": ""
          },
          {
            "subtitulo": "Rectal",
            "sub_valor": ""
          },
          {
            "subtitulo": "Oral",
            "sub_valor": ""
          },
          {
            "subtitulo": "Auricular",
            "sub_valor": ""
          }
        ]
      },
      {
        "titulo": "FRECUENCIA CARDIACA",
        "campo": "frec_card",
        "tipo": "TXTL",
        "estado": "true",
        "orden": "60",
        "colclass": "col-md-4",
        "valor": "",
        "validacion": "frmRender.frec_card.$invalid",
        "posicion": "UP",
        "columnas": "1"
      },
      {
        "titulo": "PRESION ARTERIAL",
        "campo": "pres_art",
        "tipo": "TXTL",
        "estado": "ESCRITURA",
        "orden": "70",
        "colclass": "col-md-4",
        "valor": "",
        "posicion": "UP",
        "columnas": "1",
        "validacion": "frmRender.pres_art.$invalid"
      },
      {
        "titulo": "FRECUENCIA RESPIRATORIA",
        "campo": "frec_resp",
        "tipo": "TXTL",
        "estado": "ESCRITURA",
        "orden": "80",
        "colclass": "col-md-4",
        "valor": "",
        "posicion": "UP",
        "columnas": "1",
        "validacion": "frmRender.frec_resp.$invalid"
      },
      {
        "titulo": "SATURACION DE OXIGENO (o2) ",
        "campo": "sat_oxigeno",
        "tipo": "TXTL",
        "estado": "ESCRITURA",
        "orden": "80",
        "colclass": "col-md-4",
        "valor": "",
        "posicion": "UP",
        "columnas": "1",
        "validacion": "frmRender.frec_resp.$invalid"
      },
      {
        "titulo": "",
        "campo": "linea",
        "tipo": "SUBTIT",
        "estado": "LECTURA",
        "orden": "225",
        "colclass": "col-md-12",
        "valor": "1"
      },
      {
        "titulo": "ANTECEDENTES:",
        "campo": "ant_pers",
        "tipo": "TAR",
        "estado": "ESCRITURA",
        "orden": "150",
        "colclass": "col-md-6",
        "valor": "",
        "validacion": "frmRender.observaciones.$invalid",
        "posicion": "UP",
        "columnas": "1"
      },
      {
        "titulo": "S: MOTIVO DE LA CONSULTA (ANAMNESIS):",
        "campo": "mot_cons",
        "tipo": "TARN",
        "colclass": "col-md-6",
        "estado": "NECESARIO",
        "orden": "90",
        "valor": "",
        "validacion": "frmRender.mot_cons.$invalid",
        "posicion": "UP",
        "columnas": "1"
      },
      {
        "titulo": "HISTORIA DE LA ENFERMEDAD ACTUAL:",
        "campo": "hist_enf",
        "tipo": "TAR",
        "estado": "ESCRITURA",
        "orden": "150",
        "colclass": "col-md-6",
        "valor": "",
        "validacion": "frmRender.observaciones.$invalid",
        "posicion": "UP",
        "columnas": "1"
      },
      {
        "titulo": "O: EXAMEN FISICO GENERAL:",
        "campo": "ex_fisico",
        "tipo": "TARN",
        "estado": "NECESARIO",
        "orden": "100",
        "colclass": "col-md-6",
        "valor": "",
        "validacion": "frmRender.ex_fisico.$invalid",
        "posicion": "UP",
        "columnas": "1"
      },
      {
        "titulo": "O: EXAMEN FISICO SEGMENTARIO",
        "campo": "ex_fisico_seg",
        "tipo": "FOR_OC",
        "estado": "NECESARIO",
        "orden": "101",
        "colclass": "col-md-12",
        "valor": "",
        "datos": [
          {
            "titulo": "CABEZA / CUELLO",
            "campo": "cabeza_cuello",
            "tipo": "TAR",
            "posicion": "UP",
            "columnas": "1",
            "estado": "ESCRITURA",
            "orden": "5",
            "colclass": "col-md-6",
            "valor": "",
            "validacion": "frmRender.observaciones.$invalid"
          },
          {
            "titulo": "TÓRAX",
            "campo": "torax",
            "tipo": "TAR",
            "posicion": "UP",
            "columnas": "1",
            "estado": "ESCRITURA",
            "orden": "10",
            "colclass": "col-md-6",
            "valor": "",
            "validacion": "frmRender.observaciones.$invalid"
          },
          {
            "titulo": "RESPIRATORIO",
            "campo": "respiratorio",
            "tipo": "TAR",
            "posicion": "UP",
            "columnas": "1",
            "estado": "ESCRITURA",
            "orden": "15",
            "colclass": "col-md-6",
            "valor": "",
            "validacion": "frmRender.observaciones.$invalid"
          },
          {
            "titulo": "ABDOMEN",
            "campo": "abdomen",
            "tipo": "TAR",
            "posicion": "UP",
            "columnas": "1",
            "estado": "ESCRITURA",
            "orden": "20",
            "colclass": "col-md-6",
            "valor": "",
            "validacion": "frmRender.observaciones.$invalid"
          },
          {
            "titulo": "GENITO URINARIO",
            "campo": "genito_urinario",
            "tipo": "TAR",
            "posicion": "UP",
            "columnas": "1",
            "estado": "ESCRITURA",
            "orden": "25",
            "colclass": "col-md-6",
            "valor": "",
            "validacion": "frmRender.observaciones.$invalid"
          },
          {
            "titulo": "EXTREMIDADES",
            "campo": "extremidades",
            "tipo": "TAR",
            "posicion": "UP",
            "columnas": "1",
            "estado": "ESCRITURA",
            "orden": "30",
            "colclass": "col-md-6",
            "valor": "",
            "validacion": "frmRender.observaciones.$invalid"
          },
          {
            "titulo": "NEUROLOGICO",
            "campo": "neurologico",
            "tipo": "TAR",
            "posicion": "UP",
            "columnas": "1",
            "estado": "ESCRITURA",
            "orden": "35",
            "colclass": "col-md-6",
            "valor": "",
            "validacion": "frmRender.observaciones.$invalid"
          },
          {
            "titulo": "CARDIOVASCULAR",
            "campo": "cardiovascular",
            "tipo": "TAR",
            "posicion": "UP",
            "columnas": "1",
            "estado": "ESCRITURA",
            "orden": "40",
            "colclass": "col-md-6",
            "valor": "",
            "validacion": "frmRender.observaciones.$invalid"
          },
          {
            "titulo": "OTROS",
            "campo": "otro_examenes_fisicos",
            "tipo": "TAR",
            "posicion": "UP",
            "columnas": "1",
            "estado": "ESCRITURA",
            "orden": "45",
            "colclass": "col-md-6",
            "valor": "",
            "validacion": "frmRender.observaciones.$invalid"
          }
        ]
      },
      {
        "titulo": "ESTADO NUTRICIONAL",
        "campo": "gest_nut",
        "tipo": "SUBTIT",
        "estado": "NECESARIO",
        "orden": "105",
        "colclass": "col-md-12",
        "valor": ""
      },
      {
        "titulo": "ESTADO NUTRICIONAL:",
        "campo": "est_nutr",
        "tipo": "CBON",
        "estado": "NECESARIO",
        "orden": "110",
        "colclass": "col-md-6",
        "tipo_dato": "sql",
        "data": [
          {
            "valor": "5",
            "dato": "DESNUTRICION MODERADA",
            "valor2": "DESNUTRICION MODERADA"
          },
          {
            "valor": "4",
            "dato": "DESNUTRICION GRAVE",
            "valor2": "DESNUTRICION GRAVE"
          },
          {
            "valor": "3",
            "valor2": "NORMAL",
            "dato": "NORMAL"
          },
          {
            "valor": "2",
            "valor2": "SOBREPESO",
            "dato": "SOBREPESO"
          },
          {
            "valor": "1",
            "valor2": "OBESIDAD",
            "dato": "OBESIDAD"
          }
        ],
        "valor": "",
        "validacion": "frmRender.est_nutr.$invalid"
      },
      {
        "titulo": "A: DIAGNOSTICOS",
        "campo": "gdiagnosticos",
        "tipo": "SUBTIT",
        "estado": "NECESARIO",
        "orden": "125",
        "colclass": "col-md-12",
        "valor": ""
      },
      {
        "titulo": "DIAGNOSTICO DESCRIPTIVO:",
        "campo": "diag_desc",
        "tipo": "TARN",
        "estado": "NECESARIO",
        "orden": "130",
        "colclass": "col-md-6",
        "valor": "",
        "posicion": "UP",
        "columnas": "1",
        "validacion": "frmRender.diag_desc.$invalid"
      },
      {
        "titulo": "DIAGNOSTICOS CIE 10:",
        "campo": "diag_cie10",
        "tipo": "TARMOD",
        "estado": "ESCRITURA",
        "orden": "150",
        "colclass": "col-md-6",
        "valor": "",
        "posicion": "UP",
        "columnas": "1",
        "validacion": "false"
      },
      {
        "titulo": "P: TRATAMIENTO:",
        "campo": "tratamiento",
        "tipo": "TARN",
        "estado": "NECESARIO",
        "orden": "140",
        "colclass": "col-md-6",
        "valor": "",
        "posicion": "UP",
        "columnas": "1",
        "validacion": "frmRender.tratamiento.$invalid"
      },
      {
        "titulo": "OBSERVACIONES:",
        "campo": "observaciones",
        "tipo": "TAR",
        "estado": "ESCRITURA",
        "orden": "150",
        "colclass": "col-md-6",
        "valor": "",
        "posicion": "UP",
        "columnas": "1",
        "validacion": "frmRender.observaciones.$invalid"
      }
    ]
  }
  ngOnInit(): void {
    this.dataFormulario = JSON.parse(this.formulario);
    this.superior = [
      { piesa_dental: 18 },
      { piesa_dental: 17 },
      { piesa_dental: 16 },
      { piesa_dental: 15 },
      { piesa_dental: 14 },
      { piesa_dental: 13 },
      { piesa_dental: 12 },
      { piesa_dental: 11 },

      { piesa_dental: 21 },
      { piesa_dental: 22 },
      { piesa_dental: 23 },
      { piesa_dental: 24 },
      { piesa_dental: 25 },
      { piesa_dental: 26 },
      { piesa_dental: 27 },
      { piesa_dental: 28 }
    ];
    this.inferior = [
      { piesa_dental: 48 },
      { piesa_dental: 47 },
      { piesa_dental: 46 },
      { piesa_dental: 45 },
      { piesa_dental: 44 },
      { piesa_dental: 43 },
      { piesa_dental: 42 },
      { piesa_dental: 41 },

      { piesa_dental: 31 },
      { piesa_dental: 32 },
      { piesa_dental: 33 },
      { piesa_dental: 34 },
      { piesa_dental: 35 },
      { piesa_dental: 36 },
      { piesa_dental: 37 },
      { piesa_dental: 38 }
    ];
    this.superior_menor = [
      { piesa_dental: 55 },
      { piesa_dental: 54 },
      { piesa_dental: 53 },
      { piesa_dental: 52 },
      { piesa_dental: 51 },

      { piesa_dental: 61 },
      { piesa_dental: 62 },
      { piesa_dental: 63 },
      { piesa_dental: 64 },
      { piesa_dental: 65 }
    ];
    this.inferior_menor = [
      { piesa_dental: 85 },
      { piesa_dental: 84 },
      { piesa_dental: 83 },
      { piesa_dental: 82 },
      { piesa_dental: 81 },

      { piesa_dental: 71 },
      { piesa_dental: 72 },
      { piesa_dental: 73 },
      { piesa_dental: 74 },
      { piesa_dental: 75 }
    ];
  }

  cambio_tipo(data:any) {
    console.log("data", data);
  }

  piesa(id:any, tipo:any) {
    if (tipo == 'superior') {
      if (this.tipo_seleccionado == 'sano') {
        this.campo = '{"piesa_dental":' + this.superior[id].piesa_dental + '}';
        this.superior[id] = JSON.parse(this.campo);
      } else {
        this.campo = JSON.stringify(this.superior[id]).replace('}', '') + ', "' + this.tipo_seleccionado + '":' + true + '}';
        this.superior[id] = JSON.parse(this.campo);
      }
    }
    if (tipo == 'inferior') {
      if (this.tipo_seleccionado == 'sano') {
        this.campo = '{"piesa_dental":' + this.inferior[id].piesa_dental + '}';
        this.inferior[id] = JSON.parse(this.campo);
      } else {
        this.campo = JSON.stringify(this.inferior[id]).replace('}', '') + ', "' + this.tipo_seleccionado + '":' + true + '}';
        this.inferior[id] = JSON.parse(this.campo);
      }
    }
    if (tipo == 'superior_menor') {
      if (this.tipo_seleccionado == 'sano') {
        this.campo = '{"piesa_dental":' + this.superior_menor[id].piesa_dental + '}';
        this.superior_menor[id] = JSON.parse(this.campo);
      } else {
        this.campo = JSON.stringify(this.superior_menor[id]).replace('}', '') + ', "' + this.tipo_seleccionado + '":' + true + '}';
        this.superior_menor[id] = JSON.parse(this.campo);
      }
    }
    if (tipo == 'inferior_menor') {
      if (this.tipo_seleccionado == 'sano') {
        this.campo = '{"piesa_dental":' + this.inferior_menor[id].piesa_dental + '}';
        this.inferior_menor[id] = JSON.parse(this.campo);
      } else {
        this.campo = JSON.stringify(this.inferior_menor[id]).replace('}', '') + ', "' + this.tipo_seleccionado + '":' + true + '}';
        this.inferior_menor[id] = JSON.parse(this.campo);
      }
    }
  }
  seleccion_tipo(data:any) {
    console.log("data-------", data);
  }

  cie10_ingreso(){
    this.dialog.open(Cie10Component, {
        width: '1300px',
    }).afterClosed().subscribe(result => {
      console.log(this.dataFormulario);
      for (let i = 0; i < this.dataFormulario.length; i++) {
        if (this.dataFormulario[i].tipo == 'TARMOD') {
          this.dataFormulario[i].valor = result;
        }
      }
      console.log(result);

      });
  }

  limpiarCIE10(){
    for (let i = 0; i < this.dataFormulario.length; i++) {
      if (this.dataFormulario[i].tipo == 'TARMOD') {
        this.dataFormulario[i].valor = "";
      }
    }
  }
}
