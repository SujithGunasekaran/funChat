import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';


const store = createStore(
    compose(
        applyMiddleware(thunk)
    )
);

export default store;
