import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import { ACTIVAR_LOADING, DESACTIVAR_LOADING } from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  // TRABAJAREMOS CON REACTIVE FORM:
  // Da el control del formulario del lado del componente y no del template como en Login y Register
  forma: FormGroup;
  tipo = 'ingreso';
  loadingSubs: Subscription = new Subscription();
  cargando: boolean;

  constructor( public ingresoEgresoService: IngresoEgresoService,
               private store: Store<AppState> ) { }

  ngOnInit() {

    this.loadingSubs = this.store.select('ui')
         .subscribe( ui => this.cargando = ui.isLoading );

    this.forma = new FormGroup({
        descripcion: new FormControl( '', Validators.required),
        monto: new FormControl( 0, Validators.min( 0 ) )
    });
  }
  ngOnDestroy() {
    this.loadingSubs.unsubscribe();
  }
  crearIngresoEgreso() {
     this.store.dispatch( ACTIVAR_LOADING() );
     const ingresoEgreso = new IngresoEgreso( {...this.forma.value, tipo: this.tipo} );
     // console.log(ingresoEgreso);
     this.ingresoEgresoService.crearIngresoEgreso( ingresoEgreso )
         .then( () => {
          Swal.fire({
            title: ingresoEgreso.descripcion,
            text: 'Guardado',
            icon: 'success'
          });
          this.forma.reset({
            monto: 0
           });
          this.store.dispatch( DESACTIVAR_LOADING() );
         })
         .catch( err => {
          Swal.fire({
            title: 'Error Crear Ingreso-Egreso',
            text: err.message,
            icon: 'error'
          });
          this.store.dispatch( DESACTIVAR_LOADING() );
         });
  }

}
