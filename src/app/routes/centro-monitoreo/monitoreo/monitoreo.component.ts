import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { SocketIoService } from 'app/routes/socket/socket-io.service';
import { CookieService } from 'ngx-cookie-service';
import { CentroMonitoreoService } from '../centro-monitoreo.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DialogSolicitudComponent } from './dialog-solicitud/dialog-solicitud.component';
import { MatButtonModule } from '@angular/material/button';
import { AppSettings, SettingsService } from '@core';
import { CdkDragStart } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-monitoreo',
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MonitoreoComponent implements OnInit {

  @Output() optionsChange = new EventEmitter<AppSettings>();

  options = this.settings.getOptions();
  opened = false;
  dragging = false;


  sql: any;
  responde: any;

  total_dataInternacion: any;
  dataInternacion: any;
  dataCubiculos: any;
  dataConsultas: any;
  dataEspecialidades: any;

  listadoHospitales: any;
  hospitalSeleccionado: any;
  constructor(
    private cookieService: CookieService,
    private socketWebService: SocketIoService,
    private toastr: ToastrService,
    private http: CentroMonitoreoService,
    public dialog: MatDialog,
    public matButtonModule: MatButtonModule,
    private settings: SettingsService
  ) {
    socketWebService.outEven.subscribe(res => {
      console.log("--00--->", res.msg);
    })
  }
  handleDragStart(event: CdkDragStart) {
    this.dragging = true;
  }

  openPanel(event: MouseEvent) {
    if (this.dragging) {
      this.dragging = false;
      return;
    }
    this.opened = true;
  }

  closePanel() {
    this.opened = false;
  }

  togglePanel() {
    this.opened! = !this.opened;
  }

  sendOptions() {
    this.optionsChange.emit(this.options);
  }

  ngOnInit() {
    this.cookieService.set('CM', 'MONITOREO');
    this.socketWebService.outEven.subscribe(res => {
      console.log("----->", res);
    });
    this.cargarDataInternaciones();
    this.listarCubiculos();
    this.listarConsultas();
    this.listarEspecialidades();
    this.listarHospitales();
  }


  notificarLlamado() {
    this.socketWebService.llamarcentroMonitoreo(true);
  }

  sendData2 = (event: any) => {
    this.socketWebService.llamarcentroMonitoreo(false);
  }

  cargarDataInternaciones() {
    const params_lista_espec_total = {};
    this.http.listaEspecialidadesTotal(params_lista_espec_total).subscribe(res => {
      this.total_dataInternacion = res.success.data;

      const params_lista_espec_cama = {};
      this.http.listaEspecialidadesCama(params_lista_espec_cama).subscribe(res => {
        this.dataInternacion = res.success.data;

        for (var i = 0; i < this.total_dataInternacion.length; i++) {
          for (var k = 0; k < this.dataInternacion.length; k++) {
            if (this.dataInternacion[k].sal_id_especialidad == this.total_dataInternacion[i].sal_id_especialidad && this.dataInternacion[k].sal_id_hospital == this.total_dataInternacion[i].sal_id_hospital) {
              this.total_dataInternacion[i].libre = this.total_dataInternacion[i].libre - this.dataInternacion[k].libre;
            }
          }
        }
        this.dataInternacion = this.total_dataInternacion;
        console.log(this.dataInternacion);
      });  
    });
  }

  listarCubiculos() {
    const params_listar_cubiculos = {};
    this.http.listaCubiculos(params_listar_cubiculos).subscribe(res => {
      this.dataCubiculos = res.success.data;
    });
  }

  listarConsultas() {
    const params_listar_consultas = {};
    this.http.listaReporteMonitoreo(params_listar_consultas).subscribe(res => {
      this.dataConsultas = res.success.data;
    });
  }

  listarEspecialidades() {
    const params_listar_especialidades = {};
    this.http.listaEspecialidadesMedico(params_listar_especialidades).subscribe(res => {
      this.dataEspecialidades = res.success.data;
    });
  }

  nuevaSolicitud(id: any) {
    if (id == 0) {
      this.hospitalSeleccionado = [];
    } else {
      for (let x = 0; x < this.listadoHospitales.length; x++) {
        if (this.listadoHospitales[x].hsp_id == id) {
          this.hospitalSeleccionado = this.listadoHospitales[x];
        }
      }
    }
    console.log('this.hospitalSeleccionado', this.hospitalSeleccionado);

    const dialogRef = this.dialog.open(DialogSolicitudComponent, {
      disableClose: true,
      width: '70%',
      data: { tipo: 'NIVEL2', campos: this.hospitalSeleccionado },
    });
    dialogRef.afterClosed().subscribe(result => {
      /*this.toastr.info('Nueva solicitud', '', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true,
        newestOnTop: false,
        extendedTimeOut: 0,
        tapToDismiss: false,
      });*/
    });
  }

  listarHospitales() {
    const params_listar_hospitales = {};
    this.http.listaHospitales(params_listar_hospitales).subscribe(res => {
      this.listadoHospitales = res.success.data;
    });
  }


}

