import { createAction, props } from '@ngrx/store';
import { User } from './user.model';


export const SET_USER = createAction('[Auth] Set User', props<{ user: User }>());

