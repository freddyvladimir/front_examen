import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as geojson from 'geojson';

@Component({
  selector: 'app-mapa-monitoreo',
  templateUrl: './mapa-monitoreo.component.html',
  styleUrls: ['./mapa-monitoreo.component.scss']
})
export class MapaMonitoreoComponent implements OnInit, AfterViewInit {
  private map!: L.Map;
  coordenadas: string = "";
  latlngs: [number, number][] = [];
  constructor() { }

  ngOnInit(): void {
    this.latlngs = [
      [-16.500437, -68.123385],
      [-16.498023, -68.124268],
      [-16.497223, -68.124268]
    ];
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

    L.control.layers(baseMaps, overlayMaps).addTo(this.map);

    //this.map.on('click', this.updateMarkerEdit);

    this.map.on('click', <LeafletMouseEvent>(e: any) => {
      console.log(e)
      this.coordenadas = (e.latlng).toString();
      var latitud = e.latlng.lat;
      var longitud = e.latlng.lng;
      console.log(latitud);

      this.getPoints(latitud, longitud);
      //this.updateMarkerEdit(e);

      /*const latlngs:[number,number][] = [
        [-16.500437, -68.123385],
        [-16.498023, -68.124268],
        [-16.497223, -68.124268]
      ];
      var polyline = L.polyline(latlngs, { color: 'red' }).addTo(this.map);
      this.map.fitBounds(polyline.getBounds());*/
    });
  }

  getPoints(lat: number, long: number): void {
    //getPoints():void{

    console.log("00", this.latlngs);

    this.latlngs.push([lat, long]);
    console.log("22", this.latlngs);
    //latlngs.push([-16.496819970769774, -68.12409692799409]);
    var polyline = L.polyline(this.latlngs, { color: 'red' }).addTo(this.map);

    L.circle([
      -16.500437, -68.123385
    ], {
      color: 'white', weight: 1, fillColor: 'green',
      fillOpacity: 1, radius: 7.5
    }).addTo(this.map).bindPopup("INICIO");

    L.circle([
      lat, long
    ], {
      color: 'white', weight: 1, fillColor: 'red',
      fillOpacity: 1, radius: 7.5
    }).addTo(this.map).bindPopup("FINAL");


    this.map.fitBounds(polyline.getBounds());

  }

  setPoints(): void {
    //getPoints():void{
    this.latlngs = [];
    var polyline = L.polyline(this.latlngs, { color: 'red' }).addTo(this.map);
    /*  
          L.circle([
            -16.500437, -68.123385
          ],{
            color:'white',weight:1,fillColor:'green',
            fillOpacity:1,radius:7.5
          }).addTo(this.map).bindPopup("INICIO");
      
          L.circle([
            lat, long
          ],{
            color:'white',weight:1,fillColor:'red',
            fillOpacity:1,radius:7.5
          }).addTo(this.map).bindPopup("FINAL");
    */
    this.map.fitBounds(polyline.getBounds());
  }



}
