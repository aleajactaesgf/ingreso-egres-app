import { createReducer, on, Action } from '@ngrx/store';
import * as fromUI from './ui.actions';

export interface State {
    isLoading: boolean;
}

export const initState: State = {
    isLoading: false
};


const UIREDUCER = createReducer(
    initState,
    on( fromUI.ACTIVAR_LOADING, state => ( {...state, isLoading: true })),
    on( fromUI.DESACTIVAR_LOADING, state => ( {...state, isLoading: false }))
  );


export function uiReducer(state: State | undefined, action: Action) {
            return UIREDUCER(state, action);
       }
