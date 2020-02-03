import { createReducer, on, Action } from '@ngrx/store';
import * as fromIngresoEgreso from './ingreso-egreso.actions';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AppState } from 'src/app/app.reducer';

export interface IngresoEgresoState {
    items: IngresoEgreso[];
}

export interface AppStateIngresoEgreso extends AppState {
    ingresoEgreso: IngresoEgresoState;
}

const initState: IngresoEgresoState = {
    items: []
};

const INGRESO_EGRESO_REDUCER = createReducer(
    initState,
    on(fromIngresoEgreso.SET_ITEMS, (state, { items }) => {
        return {
            items: [
                ...items.map( item => {
                    return {
                        ...item
                    };
                })
            ]
        };
    }),
    on( fromIngresoEgreso.UNSET_ITEMS, () => ({items: []}))
);

export function ingresoEgresoReducer(state: IngresoEgresoState | undefined, action: Action) {
    return INGRESO_EGRESO_REDUCER(state, action);
}

