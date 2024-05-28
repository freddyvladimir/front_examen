import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, tap } from 'rxjs/operators';
import { AuthService, User } from '@core/authentication';

@Component({
  selector: 'app-user',
  template: `
    <button
      class="matero-toolbar-button matero-avatar-button"
      mat-button
      [matMenuTriggerFor]="menu"
    >
      <img class="matero-avatar" [src]="data.avatar" width="32" alt="avatar" />
      <span class="matero-username" fxHide.lt-sm>{{ user.name }}</span>
    </button>

    <mat-menu #menu="matMenu">
      <button routerLink="/profile/overview" mat-menu-item>
        <mat-icon>account_circle</mat-icon>
        <span>{{ usuario }}</span>
      </button>
      <button routerLink="/profile/settings" mat-menu-item>
        <mat-icon>settings</mat-icon>
        <span>{{ hospital | uppercase }}</span>
      </button>
      <button mat-menu-item (click)="logout()">
        <mat-icon>exit_to_app</mat-icon>
        <span>Salir</span>
      </button>
    </mat-menu>
  `,
})
export class UserComponent implements OnInit {
  user!: User;
  usuario:any;
  dataUser:any = {};
  keyId:string = 'usr';
  data:any={};
  hospital: any; 
  constructor(private router: Router, private auth: AuthService, private cdr: ChangeDetectorRef) {
    
    
  }

  ngOnInit(): void {
    this.auth
      .user()
      .pipe(
        tap(user => (this.user = user)),
        debounceTime(10)
      )
      .subscribe(() => this.cdr.detectChanges());
      this.dataUser = sessionStorage.getItem(this.keyId);
      this.data.avatar = './assets/images/iconoMed.png';  
      
      
      this.hospital = sessionStorage.getItem('NOMBRE_HOSPITAL');
      this.hospital = this.hospital;
      //this.hospital = this.hospital.toLowerCase();
      console.log(this.hospital);
      
      this.usuario = sessionStorage.getItem('usuario');
      
  }

  logout() {
    //this.auth.logout().subscribe(() => this.router.navigateByUrl('/auth/login'));
    this.auth.removeSession('menu');
    this.auth.removeSession('token');
    this.auth.removeSession('codigo');
    this.auth.removeSession('usuario');

    this.auth.removeSession("ID_HOSPITAL");
    this.auth.removeSession("NOMBRE_HOSPITAL");
    this.auth.removeSession("IDUSUARIO");
    this.auth.removeSession("CODIGO_HOSPITAL");

    this.auth.removeSession(this.keyId);
    
    this.router.navigateByUrl('/auth/login');
  }
}
