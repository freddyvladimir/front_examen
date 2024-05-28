import { Component, OnInit } from '@angular/core';
import { SocketIoService } from 'app/routes/socket/socket-io.service';
import { CookieService } from 'ngx-cookie-service';
import { FichasService } from '../fichas.service';

@Component({
  selector: 'app-page-dispensador',
  templateUrl: './page-dispensador.component.html',
  styleUrls: ['./page-dispensador.component.scss']
})
export class PageDispensadorComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  IDUSUARIO = 1;
  
  sql: any;
  responde: any;

  constructor(
    private http: FichasService,
    private socketWebService: SocketIoService,
    private cookieService: CookieService,
  ) {
    socketWebService.callbackFI.subscribe(res => {
      console.log("--00--->", res);
    })
  }

  ngOnInit(): void {
    this.cookieService.set('CM', 'FICHAS');
    this.socketWebService.callbackFI.subscribe(res => {
      console.log("----->", res);
    });
  }

  sacarFicha(){
    console.log("SACAR FICHA");
    this.sql = {
      consulta: 'select * from sp_insertar_ficha_admision ('+ this.CODIGO_HOSPITAL + ', '+ this.IDUSUARIO +')'
    };
    this.http.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        console.log(this.responde.success.data[0].sp_dinamico);
        this.socketWebService.listarFichas(true);
      }
    });
  }

}
