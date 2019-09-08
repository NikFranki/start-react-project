import { ADDTODO, HomeActionTypes } from './types'

export function addTodo(todo): HomeActionTypes {
    return {
        type: ADDTODO,
        payload: todo
    }
}