import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from '../ingreso-egreso.model';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs, 'es');
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  items: IngresoEgreso[];
  subscription: Subscription = new Subscription();
  constructor( private store: Store<AppState>,
               public ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.subscription = this.store.select('ingresoEgreso')
        .subscribe( ingresoEgreso => {
              // console.log(ingresoEgreso.items);
              this.items = ingresoEgreso.items;
        });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  borrarItem( item: IngresoEgreso) {

    Swal.fire({
      title: 'Eliminar',
      text: `¿Desea borrar ${item.descripcion}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {

        this.ingresoEgresoService.borrarIngresoEgreso( item.uid )
          .then( () => {
            Swal.fire({
              title: 'Eliminado',
              text: item.descripcion,
              icon: 'success'
            });
          })
          .catch( error => {
            Swal.fire({
              title: 'Error Borrar Item',
              text: error.message,
              icon: 'error'
            });
          });
      }
    });



  }

}
