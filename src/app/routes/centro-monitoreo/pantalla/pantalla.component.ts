import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AppSettings, SettingsService } from '@core';
import { SocketIoService } from 'app/routes/socket/socket-io.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-pantalla',
  templateUrl: './pantalla.component.html',
  styleUrls: ['./pantalla.component.scss']
})
export class PantallaComponent implements OnInit {
  @Output() optionsChange = new EventEmitter<AppSettings>();
  audio: any;
  tipoImg: any;
  options = this.settings.getOptions();
  constructor(
    private cookieService: CookieService,
    private socketWebService: SocketIoService,
    private settings: SettingsService) {
    this.socketWebService.outEven.subscribe(res => {
      console.log("<----->", res);
      this.alarma(res);
    });
    this.socketWebService.callbackCM.subscribe(res => {
      console.log("<---***--->", res);
    });
  }
  sendOptions() {
    this.optionsChange.emit(this.options);
  }
  ngOnInit(): void {
    this.cookieService.set('CM', 'MONITOREO');
    this.tipoImg = "no_alert.png";
    this.audio = new Audio('assets/audio/alerta.mp3');
  }

  alarma(tipo: any): void {
    if (tipo) {
      this.tipoImg = "alert.gif";
      this.audio.loop = true;
      this.audio.play();
    } else {
      this.tipoImg = "no_alert.png";
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

}

