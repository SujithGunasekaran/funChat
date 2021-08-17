import { combineReducers } from 'redux';
import userReducer from './userReducer';
import userVideoReducer from './userVideoReducer';

export default combineReducers({
    userReducer,
    userVideoReducer
})
