import { OnInit, AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConsultaExternaService } from '../consulta-externa.service';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

/** Constants used to fill up our data base. */
const FRUITS: string[] = [
  'blueberry',
  'lychee',
  'kiwi',
  'mango',
  'peach',
  'lime',
  'pomegranate',
  'pineapple',
];
const NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];

@Component({
  selector: 'app-page-cajas',
  templateUrl: './page-cajas.component.html',
  styleUrls: ['./page-cajas.component.scss']
})
export class PageCajasComponent implements OnInit {  
  CODIGO_HOSPITAL = sessionStorage.getItem('ID_HOSPITAL');
  displayedColumns: string[] = ['siis', 'sice', 'registro', 'atencion', 'paciente', 'origenFicha', 'servicios', 'codigoFicha', 'tipoConsulta'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  datosPaciente:any = [];

  sql: any;
  responde: any;
  constructor(private http: ConsultaExternaService) {
    //const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.listaRegistros();
  }

  listaRegistros(){
    this.sql = {
      consulta: 'select * from sp_lst_pacientes_asignados_caja_nuevo('+this.CODIGO_HOSPITAL+',$$1$$)'
    };
    this.http.dinamico(this.sql).subscribe(res => {
      this.responde = res as { message: string };
      if (this.responde.success.data[0].sp_dinamico != null) {
        console.log(this.responde.success.data[0].sp_dinamico);
        this.datosPaciente = this.responde.success.data[0].sp_dinamico;
          this.dataSource = new MatTableDataSource(this.datosPaciente);
          this.ngAfterViewInit();
      } else {
        
      }
    });
  }
}


function createNewUser(id: number): UserData {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
    ' ' +
    NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
    '.';

  return {
    id: id.toString(),
    name: name,
    progress: Math.round(Math.random() * 100).toString(),
    fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
  };
}