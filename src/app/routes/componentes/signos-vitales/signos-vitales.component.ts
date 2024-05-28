import { Component, OnInit, Input, HostBinding } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-signos-vitales',
  templateUrl: './signos-vitales.component.html',
  styleUrls: ['./signos-vitales.component.scss'],
  animations: [
    trigger('grow', [
      state('true', style({
        height: '{{temperaturaHeight}}px',
      }), { params: { temperaturaHeight: 1 } }),
      state('false', style({
        height: '{{temperaturaHeight}}px',
      }), { params: { temperaturaHeight: 1 } }),
      transition('true => false', animate('600ms ease-in')),
      transition('false => true', animate('600ms ease-in'))

    ]),
    trigger('grow2', [
      state('true', style({
        height: '{{temperaturaHeight}}px',
      }), { params: { temperaturaHeight: 1 } }),
      state('false', style({
        height: '{{temperaturaHeight}}px',
      }), { params: { temperaturaHeight: 1 } }),
      transition('true => false', animate('600ms ease-in')),
      transition('false => true', animate('600ms ease-in'))

    ]),

    trigger('growRectal', [
      state('true', style({
        height: '{{temperaturaRectalHeight}}px',
      }), { params: { temperaturaRectalHeight: 1 } }),
      state('false', style({
        height: '{{temperaturaRectalHeight}}px',
      }), { params: { temperaturaRectalHeight: 1 } }),
      transition('true => false', animate('600ms ease-in')),
      transition('false => true', animate('600ms ease-in'))

    ]),
    trigger('growRectal2', [
      state('true', style({
        height: '{{temperaturaRectalHeight}}px',
      }), { params: { temperaturaRectalHeight: 1 } }),
      state('false', style({
        height: '{{temperaturaRectalHeight}}px',
      }), { params: { temperaturaRectalHeight: 1 } }),
      transition('true => false', animate('600ms ease-in')),
      transition('false => true', animate('600ms ease-in'))

    ]),

    trigger('growOral', [
      state('true', style({
        height: '{{temperaturaOralHeight}}px',
      }), { params: { temperaturaOralHeight: 1 } }),
      state('false', style({
        height: '{{temperaturaOralHeight}}px',
      }), { params: { temperaturaOralHeight: 1 } }),
      transition('true => false', animate('600ms ease-in')),
      transition('false => true', animate('600ms ease-in'))

    ]),
    trigger('growOral2', [
      state('true', style({
        height: '{{temperaturaOralHeight}}px',
      }), { params: { temperaturaOralHeight: 1 } }),
      state('false', style({
        height: '{{temperaturaOralHeight}}px',
      }), { params: { temperaturaOralHeight: 1 } }),
      transition('true => false', animate('600ms ease-in')),
      transition('false => true', animate('600ms ease-in'))

    ]),
    trigger('growAuricular', [
      state('true', style({
        height: '{{temperaturaAuricularHeight}}px',
      }), { params: { temperaturaAuricularHeight: 1 } }),
      state('false', style({
        height: '{{temperaturaAuricularHeight}}px',
      }), { params: { temperaturaAuricularHeight: 1 } }),
      transition('true => false', animate('600ms ease-in')),
      transition('false => true', animate('600ms ease-in'))

    ]),
    trigger('growAuricular2', [
      state('true', style({
        height: '{{temperaturaAuricularHeight}}px',
      }), { params: { temperaturaAuricularHeight: 1 } }),
      state('false', style({
        height: '{{temperaturaAuricularHeight}}px',
      }), { params: { temperaturaAuricularHeight: 1 } }),
      transition('true => false', animate('600ms ease-in')),
      transition('false => true', animate('600ms ease-in'))

    ])
  ]

})
export class SignosVitalesComponent implements OnInit {

  @Input() signosVitales: any = "";

  silueta: any;

  //@Input() temperatura:any="";

  animClass: any = true;

  isDisabled: any = false;

  siluetaHombre = ["hombre-bajopeso.png", "hombre-normal.png", "hombre-sobrepeso.png", "hombre-obesidad-g1.png", "hombre-obesidad-g2.png", "hombre-obesidad-g3.png"];
  siluetaMujer = ["mujer-bajopeso.png", "mujer-normal.png", "mujer-sobrepeso.png", "mujer-obesidad-g1.png", "mujer-obesidad-g2.png", "mujer-obesidad-g3.png"];

  constructor() { }

  growth = {
    value: 'test',
    params: { temperaturaHeight: 150 }
  }
  temperaturaHeight = 30;
  temperaturaRectalHeight = 30;
  temperaturaOralHeight = 30;
  temperaturaAuricularHeight = 30;
  valueState = true;
  ngOnInit(): void {

    this.temperaturaHeight = this.signosVitales.temperaturaAxilar;
    this.temperaturaRectalHeight = this.signosVitales.temperaturaRectal;
    this.temperaturaOralHeight = this.signosVitales.temperaturaOralHeight;
    this.temperaturaAuricularHeight = this.signosVitales.temperaturaAuricular;
    this.valueState = !this.valueState;
    this.changeIMC();

    if (this.signosVitales.context == "read") {
      this.isDisabled = true;
    }
  }
  @HostBinding('@grow') get grow() {
    //console.log("temperaturaHeight: " + this.temperaturaHeight);

    return this.growth
  }

  getGrowth(): any {
    return this.growth;
  }

  changeTemp(): void {
    this.temperaturaHeight = this.signosVitales.temperaturaAxilar;
    this.valueState = !this.valueState;// !this.valueState;
    //console.log("KEYUP: " + this.temperaturaHeight);
  }

  changeTempRectal(): void {
    this.temperaturaRectalHeight = this.signosVitales.temperaturaRectal;
    this.valueState = !this.valueState;// !this.valueState;
    // console.log("KEYUP: " + this.temperaturaRectalHeight);
  }

  changeTempOral(): void {
    this.temperaturaOralHeight = this.signosVitales.temperaturaOral;
    this.valueState = !this.valueState;// !this.valueState;
    console.log("KEYUP: " + this.temperaturaOralHeight);
  }

  changeTempAuricular(): void {
    this.temperaturaAuricularHeight = this.signosVitales.temperaturaAuricular;
    this.valueState = !this.valueState;// !this.valueState;
    //console.log("KEYUP: " + this.temperaturaAuricularHeight);
  }

  getPositionIMC() {
    var IMC = this.signosVitales.peso / (this.signosVitales.altura * this.signosVitales.altura);

    if (IMC < 18.5) {
      return 0;
    }
    else {
      if (IMC >= 18.5 && IMC < 25) {
        return 1;
      }
      else {
        if (IMC >= 25 && IMC < 30) {
          return 2;
        }
        else {
          if (IMC >= 30 && IMC < 35) {
            return 3;
          }
          else {
            if (IMC >= 35 && IMC < 40) {
              return 4;
            }
            else {
              return 5;
            }
          }
        }
      }
    }
  }

  changeIMC(): void {
    var posIMC = this.getPositionIMC();
    this.animClass = !this.animClass;
    // console.log("GENER0: ", this.signosVitales.genero);
    if (this.signosVitales.genero == "M") {
      this.silueta = this.siluetaHombre[posIMC];
    }
    else {
      if (this.signosVitales.genero == "F") {
        this.silueta = this.siluetaMujer[posIMC];
      }
    }
  }

}
