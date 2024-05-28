import { AfterViewInit, Component,Output, EventEmitter } from '@angular/core';
import { PrimerNivelService } from '../../primer-nivel.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { LeafletMouseEvent } from 'leaflet';

import * as L from 'leaflet';
import * as geojson from 'geojson';
import { ToastrService } from 'ngx-toastr';

export interface Zona {
  name: string;
  feature: object;
}

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements AfterViewInit {
  private map!: L.Map;

  private layerRedesSalud: any;
  private layerHospitales: any;
  private layerZonas: any;
  private layerCentrosSalud: any;

  private listZonas: string[] = [];
  coordenadas: string = "";

  stateCtrl = new FormControl();
  filteredZonas: Observable<Zona[]>;

  zonas: Zona[] = [];
  searchLayer: any = null;
  marker: any = null;
  //////////servicios/////////
  sql: any;
  responde: any;
  //////////servicios/////////
  @Output() datosMapa = new EventEmitter();
  constructor(private http: PrimerNivelService,private toastr: ToastrService) {
    this.filteredZonas = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map(zona => (zona ? this._filterStates(zona) : this.zonas.slice())),
    );
  }

  private _filterStates(value: string): Zona[] {
    const filterValue = value.toLowerCase();

    return this.zonas.filter(zona => zona.name.toLowerCase().includes(filterValue));
  }



  ngAfterViewInit(): void {
    this.coordenadas = "";
    this.map = L.map('map', {
      center: L.latLng(-16.501712152825036, -68.13568456536376),
      zoom: 13
    });

    var openStreetLayer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      minZoom: 3,
      maxZoom: 18,
      attribution: '<a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> '
    });

    openStreetLayer.addTo(this.map);

    this.initMap();
    this.getZonas();
    this.getCentrosSalud();
  }



  initMap(): void {
    const layerDistritos = L.tileLayer.wms('http://sitservicios.lapaz.bo/geoserver/lapaz/wms?', {
      styles: 'lp_distritos2019',
      layers: 'lapaz:distritos_2019',
      format: 'image/png',
      transparent: true
    });

    const layerMacrodistritos = L.tileLayer.wms('http://sitservicios.lapaz.bo/geoserver/lapaz/wms?', {
      styles: 'lp_macrodistritos2019',
      layers: 'lapaz:macrodistritos_2019',
      format: 'image/png',
      transparent: true
    });

    const layerRedesSalud = L.tileLayer.wms('http://sitservicios.lapaz.bo/geoserver/sit/wms?CQL_FILTER=codredsal%20%3D%202072+OR+codredsal%20%3D%202073+OR+codredsal%20%3D%202074+OR+codredsal%20%3D%202071+OR+codredsal%20%3D%202069', {
      styles: 'sedes_redsalud',
      layers: 'sit:sedes_redsalud',
      format: 'image/png',
      transparent: true
    });
    const overlayMaps = {
      "Redes de Salud": layerRedesSalud,
      "Macrodistritos": layerMacrodistritos,
      "Distritos": layerDistritos
    };


    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
    const layerOSMForm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery Â© <a href="http://cloudmade.com">CloudMade</a>',
      maxZoom: 18
    });

    const layerGoogleSatForm = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    const mbAttr2 = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
      'Imagery Â© <a href="https://www.mapbox.com/">Mapbox</a>',
      mbUrl2 = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

    const layerOSMgrayForm = L.tileLayer(mbUrl2, { id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr2 });

    const baseMaps = {
      "OSM": layerOSMForm,
      "OSM GRAY": layerOSMgrayForm,
      "Google SatÃ©lite": layerGoogleSatForm
    };

    this.map.addLayer(layerOSMForm);
    this.map.addLayer(layerRedesSalud);

    L.control.layers(baseMaps, overlayMaps).addTo(this.map);

    //this.map.on('click', this.updateMarkerEdit);

    this.map.on('click', <LeafletMouseEvent>(e: any) => {
      console.log(e.latlng)
      this.coordenadas = (e.latlng).toString();
      this.updateMarkerEdit(e);
    });
  }

  getCentrosSalud() {
    this.http.getCentros().subscribe(
      (res: any) => {
        console.log("-----CENTROS-------------");
        this.drawLayerPoints(res);
      },
      (err: any) => console.log(err)
    );
  }
  getZonas() {
    this.http.getZonas().subscribe(
      (res: any) => {

        this.setAutocomplete(res);
      },
      (err: any) => console.log(err)
    );
  }

  setAutocomplete(data: any) {

    for (let i = 0; i < data.features.length; i++) {
      this.zonas.push(
        {
          name: data.features[i].properties.zona,
          feature: data.features[i]
        }
      );
    }
  }
  onSelectedZona(option: any) {
    console.log(option);

    this.searchZonaPolygon(option.feature);
  }


  updateMarkerEdit(e: any) {
    console.log(e.latlng);
    this.coordenadas = (e.latlng.lat).toString() + "," + (e.latlng.lng).toString();
    console.log("---> " + this.coordenadas);
    let latLng = [e.latlng.lat, e.latlng.lng];

    if (this.marker != null) {
      this.map.removeLayer(this.marker);
    }
    

    
    try {
      this.sql = {
        "lat":e.latlng.lat,
        "lon":e.latlng.lng
      };
      this.http.redSalud(this.sql).subscribe(res => {
        this.responde = res as { message: string };
        console.log("this.responde",this.responde);
        
        this.marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map);
        let valor = {
          "lat":e.latlng.lat,
          "lon":e.latlng.lng,
          "macro":this.responde.zona.macro,
          "distrito":this.responde.zona.distrito,
          "zona":this.responde.zona.zona,
        }
        
        this.toastr.success('Usted selecciono la zona '+this.responde.zona.zona +' y pertenece a la red de salud '+this.responde.redSalud.nombrered , 'NOTA', {
          timeOut: 2000,
          progressBar: true,
          closeButton: true,
          newestOnTop: false,
          extendedTimeOut: 0,
          tapToDismiss: false
        });
        this.datosMapa.emit(valor);    
        /*if (this.responde.success.data != null) {
          console.log("atc_datos_medico", this.responde.success.data);
        }*/
      });
    } catch (error) {
    }
    
  }



  onEachFeaturePoint(feature: any, layer: any) {
    var htmlPopup = "<div>CENTRO DE SALUD</div>";
    htmlPopup += "<div><b>" + feature.properties.Nombre + "</b></div>";
    layer.bindPopup(htmlPopup);
  }

  drawLayerPoints(data: any) {
    const icon = L.icon({
      iconUrl: "assets/images/mapa/hosp.png",
      /*shadowUrl: "",
      iconSize: [38, 95],
      shadowSize: [50, 64],
      iconAnchor: [22, 94],
      shadowAnchor: [4, 62],
      popupAnchor: [-3, -76]*/
    });

    var geoJsonFeatures: geojson.FeatureCollection = data;


    var marker = L.geoJSON(geoJsonFeatures, {
      pointToLayer: (point, latlon) => {
        return L.marker(latlon, { icon: icon })
      },
      onEachFeature: this.onEachFeaturePoint
    }).addTo(this.map);


  }

  style(feature: any) {
    return {
      weight: 1,
      opacity: 0.8,
      color: '#fff',
      dashArray: '3',
      fillOpacity: 0.2,
      fillColor: "#2196F3"
    };
  }



  styleSearchPolygon(feature: any) {
    return {
      weight: 2,
      opacity: 1,
      color: '#0f0',
      dashArray: '1',
      fillOpacity: 0.1,
      fillColor: "#0f0"
    };
  }

  searchZonaPolygon(feature: any) {
    if (this.searchLayer != null) {
      this.map.removeLayer(this.searchLayer);
    }
    this.searchLayer = L.geoJSON(feature, {
      style: this.styleSearchPolygon,
    }).addTo(this.map);

    let layerSearch = L.polygon(feature.geometry.coordinates, { color: '#375DCE', weight: 2 }).addTo(this.map);
    let latlng = L.latLng(layerSearch.getBounds().getCenter()["lng"], layerSearch.getBounds().getCenter()["lat"]);
    this.map.setView(latlng, 16);

  }


}