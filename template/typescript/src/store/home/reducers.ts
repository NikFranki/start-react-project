
import {
    HomeState,
    HomeActionTypes,
    ADDTODO,
} from './types';

const initialState: HomeState = {
    text: '',
    todos: []
}

export function homeReducer(
    state = initialState,
    action: HomeActionTypes
): HomeState {
    switch (action.type) {
        case ADDTODO:
            return { ...state, ...action.payload }
        default:
            return state
    }
}