import { Component } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <a class="matero-branding" href="/">
      <img src="./assets/images/images.jpg" class="matero-branding-logo-expanded" alt="logo" />
      <span class="matero-branding-name titulos"><strong>PELICULAS</strong></span>
    </a>
  `,
})
export class BrandingComponent {}
