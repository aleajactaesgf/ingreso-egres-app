import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { IngresoEgresoService } from 'src/app/ingreso-egreso/ingreso-egreso.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {

  subscription: Subscription = new Subscription();
  nombre: string;
  email: string;

  constructor( public authService: AuthService,
               public ingresoEgresoService: IngresoEgresoService,
               private store: Store<AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('auth')
       .pipe(
         filter( auth => auth.user != null)
       )
      .subscribe( auth => {
        this.nombre = auth.user.nombre;
        this.email = auth.user.email;
      } );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logout() {
    this.ingresoEgresoService.cancelarSubscriptions();
    this.authService.logout();
  }

}
