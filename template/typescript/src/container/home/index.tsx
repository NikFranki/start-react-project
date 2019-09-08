import * as React from 'react';
import { connect } from 'react-redux';

import { AppState } from 'Store/index';

import { addTodo } from 'Store/home/actions';

import Home from 'Pages/home';

const mapStateToProps = (state: AppState) => ({
    home: state.home
});

const mapDispatchToProps = dispatch => ({
    addTodo: text => dispatch(addTodo(text))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);
