export interface HomeState {
    text: string;
    todos?: string[];
}

export interface TodoType {
    text: string;
}

export const ADDTODO = 'ADDTODO';

export interface addTodoAction {
    type: typeof ADDTODO;
    payload: TodoType
}

export type HomeActionTypes = addTodoAction