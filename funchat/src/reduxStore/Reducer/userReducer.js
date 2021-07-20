import { SET_USER_LOGGED_IN, SET_USER_INFO } from '../Types';

const InitialState = {
    loggedUserInfo: {},
    isUserLoggedIn: false
}


export default function useReducer(state = InitialState, action) {
    switch (action.type) {
        case SET_USER_INFO:
            return {
                ...state,
                loggedUserInfo: action.userInfo
            }
        case SET_USER_LOGGED_IN:
            return {
                ...state,
                isUserLoggedIn: action.isUserLoggedIn
            }
        default: return state;
    }
}

