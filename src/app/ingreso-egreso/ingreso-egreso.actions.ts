import { createAction, props } from '@ngrx/store';
import { IngresoEgreso } from './ingreso-egreso.model';


export const SET_ITEMS = createAction('[Ingreso Egreso] Set Items', props<{ items: IngresoEgreso[] }>());
export const UNSET_ITEMS = createAction('[Ingreso Egreso] Unset Items');

