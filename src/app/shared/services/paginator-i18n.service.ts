import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class PaginatorI18nService {
  paginatorIntl = new MatPaginatorIntl();

  constructor(private translate: TranslateService) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => this.getPaginatorIntl());
  }

  getPaginatorIntl() {
    this.paginatorIntl.itemsPerPageLabel = "Items por pagina:";
    this.paginatorIntl.previousPageLabel = "Anterior pagina";
    this.paginatorIntl.nextPageLabel = "Siguiente pagina";
    this.paginatorIntl.firstPageLabel = "Primero pagina";
    this.paginatorIntl.lastPageLabel = "Último pagina";
    this.paginatorIntl.getRangeLabel = this.getRangeLabel.bind(this);

    this.paginatorIntl.changes.next();

    return this.paginatorIntl;
  }

  private getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0 || pageSize === 0) {
      return this.translate.instant("sin registro", { length });
    }
    length = Math.max(length, 0);

    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex =
      startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    return this.translate.instant(startIndex +" - "+ endIndex +" de " + length , {
      startIndex: startIndex + 1,
      endIndex,
      length,
    });
  }
}
