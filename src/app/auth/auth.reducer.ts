
import * as fromAuth from './auth.actions';
import { User } from './user.model';
import { createReducer, on, Action } from '@ngrx/store';


export interface AuthState {
    user: User;
}

const initState: AuthState = {
    user: null
};

const AUTH_REDUCER = createReducer(
    initState,
    on(fromAuth.SET_USER, (state, { user }) => ({ ...state, user })),
    on(fromAuth.UNSET_USER, () => ({ user: null }))
);

export function authReducer(state: AuthState | undefined, action: Action) {
    return AUTH_REDUCER(state, action);
}

