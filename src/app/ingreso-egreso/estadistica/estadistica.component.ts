import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
// import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { Label, MultiDataSet } from 'ng2-charts';
import { AppStateIngresoEgreso } from '../ingreso-egreso.reducer';
registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: []
})
export class EstadisticaComponent implements OnInit, OnDestroy {

  ingresos: number;
  egresos: number;

  cuantosIngresos: number;
  cuantosEgresos: number;

  subscription: Subscription = new Subscription();

  public doughnutChartLabels: Label[] = ['Ingresos', 'Egresos'];
  public doughnutChartData: MultiDataSet = [];

  constructor( private store: Store<AppStateIngresoEgreso>) { }

  ngOnInit() {
    this.subscription = this.store.select('ingresoEgreso')
        .subscribe( ingresoEgreso => {
          this.contarIngresoEgreso( ingresoEgreso.items );
        });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  contarIngresoEgreso( items: IngresoEgreso[]) {
    this.ingresos = 0;
    this.egresos = 0;
    this.cuantosIngresos = 0;
    this.cuantosEgresos = 0;

    items.forEach( item => {

      // Ingresos
      if ( item.tipo === 'ingreso') {
        this.cuantosIngresos++;
        this.ingresos += item.monto;
      } else {
        this.cuantosEgresos++;
        this.egresos += item.monto;
      }

    });
    this.doughnutChartData = [ [this.ingresos, this.egresos]];

  }

}
