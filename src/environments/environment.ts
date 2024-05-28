// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://192.168.8.4:81/api/v1/servicio/login',
  useHash: false,
  
  //URL_API: 'http://192.168.8.5:9000/api/v1/',
  
  URL_API_LOGIN: 'http://192.168.8.4:81/api/v1/servicio/login',
  
  //URL_API_LOGIN: 'http://131.0.0.15/:81/api/v1/servicio/login',
  
  URL_API: 'http://localhost:8000/',

  //URL_API: 'http://192.168.8.10:3003/api/v1/',


  //URL_API: 'http://172.18.2.236:3003/api/v1/',
  URL_API_FACTURACION: 'http://192.168.5.69/ifacturacion247_pruebas/public',
  URL_API_COTAHUMA: 'http://192.168.8.10:3007/api/v1/',
  serverSocket: 'http://192.168.8.10:5000',

  centros: 'http://localhost:4200/assets/data/centros.geojson',
  zonas:'http://localhost:4200/assets/data/zonas.geojson'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
