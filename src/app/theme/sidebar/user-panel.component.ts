import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '@core/authentication';



@Component({
  selector: 'app-user-panel',
  template: `
    <div class="matero-user-panel" fxLayout="column" fxLayoutAlign="center center">
      <img class="matero-user-panel-avatar" [src]="rutaImg" alt="avatar" width="64" />
      <h4 class="matero-user-panel-name"> Administrador </h4>
      <h5 class="matero-user-panel-email"> user.admin </h5>
      <div class="matero-user-panel-icons">
        <a routerLink="/profile/overview" mat-icon-button>
          <mat-icon class="icon-18">account_circle</mat-icon>
        </a>
        <a routerLink="/profile/settings" mat-icon-button>
          <mat-icon class="icon-18">settings</mat-icon>
        </a>
        <a (click)="logout()" mat-icon-button>
          <mat-icon class="icon-18">exit_to_app</mat-icon>
        </a>
      </div>
    </div>
  `,
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent implements OnInit {
  user!: User;
  rutaImg:any;

  constructor(private router: Router, private auth: AuthService) {
    this.rutaImg = "assets/images/doctor.png";
  }

  ngOnInit(): void {
    this.auth.user().subscribe(user => (this.user = user));
    console.log("this.auth",this.auth);
  }

  logout() {
    this.auth.logout().subscribe(() => this.router.navigateByUrl('/auth/login'));
  }
}
