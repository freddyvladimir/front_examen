import { Injectable } from '@angular/core';
import { BehaviorSubject, iif, merge, of } from 'rxjs';
import { catchError, map, share, switchMap, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { LoginService } from './login.service';
import { filterObject, isEmptyObject } from './helpers';
import { User } from './interface';
import { MenuService } from '../bootstrap/menu.service';
import { Router } from '@angular/router';
//import { ToastrService } from 'ngx-toastr';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user$ = new BehaviorSubject<User>({});
  responde: any;
  key: any = "menu";
  ready: any = [];
  constructor(private loginService: LoginService, private tokenService: TokenService,
    private menuService: MenuService, private router: Router
    //, private toast: ToastrService
    //,private toastr: ToastrService
  ) {    
    //this.ready = localStorage.getItem(this.key);
    this.ready = sessionStorage.getItem(this.key);
    this.menuService.set(JSON.parse(this.ready));
  }
  /*init() {
    return new Promise<void>(resolve => this.change$.subscribe(() => resolve()));
  }*/

  change() {
    //return this.change$;
    return this.tokenService.valid();
  }

  check() {
    return this.tokenService.valid();
  }

  login(username: string, password: string, rememberMe = false) {
    return this.loginService.login(username, password, rememberMe).pipe(
      tap(token => this.tokenService.set(token)),
      map(() => this.check())
    );
  }
  setGenericStorage(name:any, data:any){
    localStorage.setItem(name, data);
  }
  setGenericSession(name:any, data:any){
    sessionStorage.setItem(name, data);
  }

  setMenuStorage(data:any){
    sessionStorage.setItem(this.key, JSON.stringify(data));
    this.menuService.set(data);
  }
  setDataStorage(data:any){
    this.tokenService.storageData(data);
  }
  storageToken(data:any){
    this.tokenService.storageToken(data);
  }
  
  /*loginAdministracion(username: string, password: string) {
    let campo = {
      "usuario": username,
      "clave": password,
      "sistema": "SIIS"
    };
    return this.loginService.loginAdministracion(campo).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.status === 200) {
        console.log("this.responde", this.responde);
        //this.tokenService.set(this.responde);//PARA GUARDAR EN LOCALSTORAGE
        this.router.navigateByUrl('/dashboard');
        console.log("accesos",this.responde.accesos[0].sp_usuario_acceso_json[0].sistemas[0].menus);
        
        this.ready = this.responde.accesos[0].sp_usuario_acceso_json[0].sistemas[0].menus;//[{ "route": "dashboard", "name": "Inicio", "type": "link", "icon": "dashboard" }, { "route": "parametricas", "name": "Parametricas", "type": "sub", "icon": "brightness_7", "children": [{ "route": "programacion-fichas", "name": "Programacion de fichas", "type": "link" }, { "route": "especialidades", "name": "Especialidades", "type": "link" }, { "route": "consultorios", "name": "Consultorios", "type": "link" }, { "route": "medico-especialidad", "name": "Medico especialidad", "type": "link" }] }, { "route": "primer-nivel", "name": "Consulta Externa", "type": "sub", "icon": "assignment", "children": [{ "route": "admisiones", "name": "Admisiones", "type": "link" }, { "route": "cajas", "name": "Cajas", "type": "link" }, { "route": "enfermeria", "name": "Enfermeria", "type": "link" }, { "route": "consultorio", "name": "Consultorio", "type": "link" }] }, { "route": "segundo-nivel", "name": "Consulta externa", "type": "sub", "icon": "assignment", "badge": { "color": "red-500", "value": "new" }, "children": [{ "route": "admisiones", "name": "Admisiones", "type": "link" }] }];
        localStorage.setItem(this.key, JSON.stringify(this.ready));
        this.menuService.set(this.ready);
      } else {
        /*this.toast.success('Usuario no reconocido', '', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true,
          newestOnTop: false,
          extendedTimeOut: 0,
          tapToDismiss: false
        });*
      }
    });
  }*/
  
  loginAdministracion(username: string, password: string,data: any) {
    return this.loginService.loginAdministracion(data);
  }
  

  refresh() {
    return this.loginService
      .refresh(filterObject({ refresh_token: this.tokenService.getRefreshToken() }))
      .pipe(
        catchError(() => of(undefined)),
        tap(token => this.tokenService.set(token)),
        map(() => this.check())
      );
  }

  logout() {
    return this.loginService.logout().pipe(
      tap(() => this.tokenService.clear()),
      map(() => !this.check())
    );
  }

  user() {
    return this.user$.pipe(share());
  }

  menu() {
    return iif(() => this.check(), this.loginService.menu(), of([]));
  }
  removeStorage(key:string){
    this.tokenService.removeStorage(key);
  }
  removeSession(key:string){
    //this.tokenService.removeStorage(key);
    sessionStorage.removeItem(key);
  }

  /*private assignUser() {
    if (!this.check()) {
      return of({}).pipe(tap(user => this.user$.next(user)));
    }

    if (!isEmptyObject(this.user$.getValue())) {
      return of(this.user$.getValue());
    }

    return this.loginService.me().pipe(tap(user => this.user$.next(user)));
  }*/
}
