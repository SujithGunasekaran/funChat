import { SET_USER_INFO, SET_USER_LOGGED_IN } from '../Types';

export const setUserInfo = (userInfo) => dispatch => {
    dispatch({
        type: SET_USER_INFO,
        userInfo: userInfo
    })
};

export const setIsUserLoggedIn = (isUserLoggedIn) => dispatch => {
    dispatch({
        type: SET_USER_LOGGED_IN,
        isUserLoggedIn: isUserLoggedIn
    })
}
