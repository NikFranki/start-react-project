import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import './index.css';

import { HomeState } from 'Store/home/types';
import { addTodo } from 'Store/home/actions';

interface HomeProps extends RouteComponentProps<{}>, React.Props<{}> {
    home: HomeState;
    addTodo: typeof addTodo;
    routes: any;
}

export interface HomeState {
    text: string;
}

export default class Homeroom extends React.Component<HomeProps, HomeState> {

    state = {
        text: '',
    };

    render() {
        return (
            <div className="home-wrapper">
                hello typescript template   
            </div>
        );
    }
}
