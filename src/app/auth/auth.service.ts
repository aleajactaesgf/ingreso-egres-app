import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import { ACTIVAR_LOADING, DESACTIVAR_LOADING } from '../shared/ui.actions';
import { SET_USER, UNSET_USER } from './auth.actions';

import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { User } from './user.model';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription = new Subscription();
  private usuario: User;

  constructor( private afAuth: AngularFireAuth,
               private router: Router,
               private afDB: AngularFirestore,
               private store: Store<AppState> ) { }

  // Metodo para saber usuario logedado
  // Solo se debe ejecutar una vez
  initAuthListener() {
    this.afAuth.authState.subscribe( ( fbUser: firebase.User ) => {
      // console.log( fbUser );
      if( fbUser ) {
        this.userSubscription = this.afDB.doc(`${fbUser.uid}/usuario`).valueChanges()
              .subscribe( (usuarioObj: any) => {
                const newUser = new User( usuarioObj );
                this.store.dispatch( SET_USER( { user: newUser} ));
                this.usuario = newUser;
              });
      } else {
        this.usuario = null;
        this.userSubscription.unsubscribe();
      }
    });
  }

  isAuth() {
    return this.afAuth.authState
            .pipe(
              map( fbUser => {
                if (fbUser == null ) {
                  this.router.navigate( ['/login']);
                }
                return fbUser != null;
              })
            );
  }

  crearUsario( nombre: string, email: string, password: string) {

    this.store.dispatch( ACTIVAR_LOADING() );

    this.afAuth.auth
        .createUserWithEmailAndPassword( email, password)
        .then( resp => {
          // console.log( resp );
          const user: User = {
            uid: resp.user.uid,
            nombre,
            email: resp.user.email

          };
          // Guardo el documento en DB de Firebase
          this.afDB.doc(`${resp.user.uid}/usuario`)
                .set( user )
                .then( () => {
                  // NAVEGAMOS AL DASHBOARD
                  this.router.navigate(['/']);
                  this.store.dispatch( DESACTIVAR_LOADING() );
                })
                .catch( error => {
                  this.store.dispatch( DESACTIVAR_LOADING() );
                  Swal.fire({
                    title: 'Error Guardar Usuario',
                    text: error.message,
                    icon: 'error'
                  });
                });

        })
        .catch( error => {
          // console.error( error );
          this.store.dispatch( DESACTIVAR_LOADING() );
          Swal.fire({
            title: 'Error Registro',
            text: error.message,
            icon: 'error'
          });
        });

  }

  login( email: string, password: string) {

    this.store.dispatch( ACTIVAR_LOADING() );

    this.afAuth.auth
        .signInWithEmailAndPassword( email, password )
        .then( resp => {
          // console.log( resp );
          // NAVEGAMOS AL DASHBOARD
          this.router.navigate(['/']);
          this.store.dispatch( DESACTIVAR_LOADING() );
        })
        .catch( error => {
          // console.error( error );
          this.store.dispatch( DESACTIVAR_LOADING() );
          Swal.fire({
            title: 'Error en el login',
            text: error.message,
            icon: 'error'
          });
        });

  }

  logout() {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
    this.store.dispatch( UNSET_USER());
  }

  getUsuario() {
    // Se rompe la referencia con ...
    return { ...this.usuario };
  }

}
