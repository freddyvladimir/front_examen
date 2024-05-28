
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from '@env/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService extends Socket {

  @Output() outEven: EventEmitter<any> = new EventEmitter();
  @Output() callbackCM: EventEmitter<any> = new EventEmitter();
  @Output() callbackFI: EventEmitter<any> = new EventEmitter();
  @Output() callbackFIM: EventEmitter<any> = new EventEmitter();

  constructor(private cookieService:CookieService) {
    super({
      url: environment.serverSocket,
      options: {
        query: {
          nameRoom: cookieService.get('CM')
        },
      }
    })
    this.listen();
  }

  listen = () => {
    this.ioSocket.on('evento', (res: any) => this.outEven.emit(res));
    this.ioSocket.on('event', (res: any) => this.callbackCM.emit(res));

    this.ioSocket.on('tolist', (res: any) => this.callbackFI.emit(res));
    this.ioSocket.on('callmonitor', (res: any) => this.callbackFIM.emit(res));
    
  }

  llamadaCentroMonitoreo2 = () => {
    this.ioSocket.on('evento', (res: any) => this.outEven.emit(res));   
  }

  llamarcentroMonitoreo (data:any) {
    this.ioSocket.emit('evento', data);
  }



  llamarFichas (data:any) {
    this.ioSocket.emit('call', data);
  }

  listarFichas (data:any) {
    this.ioSocket.emit('file', data);
  }

  

}


/*import { Injectable, EventEmitter, Output } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from '@env/environment';
import { CookieService } from 'ngx-cookie-service';


@Injectable()
export class SocketIoService extends Socket {
@Output() outEven: EventEmitter<any> = new EventEmitter(); 
    constructor(private cookieService: CookieService) {
        super({
            url: environment.serverSocket,
            options: {
                query: {
                    payload: cookieService.get('user')
                }
            }

        });
        //this.ioSocket.on('message', res => this.outEven.emit(res))
    }
    emitEvent = (event = 'default',payload = {}) => {
        this.ioSocket.emit('default', {
            cookiePayload:this.cookieService.get('user'),
            event,
            payload
        });
    }

}*/



/*
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketIoService extends Socket {

  constructor( private cookieService:CookieService ) {
    super({
      url:'http://localhost:5000/',
      options:{
        query:{
          nameRoom: cookieService.get('room')
        }
      }
    })
  }
}
*/