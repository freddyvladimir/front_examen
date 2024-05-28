import { Component, OnInit } from '@angular/core';
import { SocketIoService } from 'app/routes/socket/socket-io.service';
import { CookieService } from 'ngx-cookie-service';
import { FichasService } from '../fichas.service';

@Component({
  selector: 'app-page-monitor',
  templateUrl: './page-monitor.component.html',
  styleUrls: ['./page-monitor.component.scss']
})
export class PageMonitorComponent implements OnInit {
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  IDUSUARIO = 1;
  
  sql: any;
  responde: any;
  audio: any;

  listadoFichas:any;

  constructor(
    private http: FichasService,
    private socketWebService: SocketIoService,
    private cookieService: CookieService,
  ) {
    socketWebService.callbackFIM.subscribe(res => {
      if (res) {
        this.llamarFichaMonitor(res);
      }
      if (res == false) {
        this.listarFichas();
      }
    })

  }

  ngOnInit(): void {
    this.cookieService.set('CM', 'FICHAS');
    this.audio = new Audio('assets/audio/ding.mp3');
    this.listarFichas();
  }

  llamarFichaMonitor(data: any) {
    this.listarFichas();
    this.audio.loop = true;
    this.audio.play();
    setTimeout(() => {
      this.audio.pause();
      this.audio.currentTime = 0;
      speechSynthesis.speak(new SpeechSynthesisUtterance("FICHA " + data.vpres_codigo_ficha + " FAVOR PASAR POR " + data.vpres_tipo_ficha + " "));
    }, 2000);
    speechSynthesis.speak(new SpeechSynthesisUtterance("FICHA " + data.vpres_codigo_ficha + " FAVOR PASAR POR " + data.vpres_tipo_ficha + " "));    
  }


  listarFichas(){
    this.sql = {
      consulta: 'select * from sp_monitoreo_fichas_usuario2 ('+ this.CODIGO_HOSPITAL + ', '+ this.IDUSUARIO +')'
    };
    this.http.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        console.log(this.responde.success.data[0].sp_dinamico);
        this.listadoFichas = this.responde.success.data[0].sp_dinamico
      }else{
        this.listadoFichas = [];
      }
    });
  }



}
