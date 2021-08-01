import {
    SET_USER_LOGGED_IN,
    SET_USER_INFO,
    SET_USER_FOLLOWER_COUNT,
    SET_USER_FOLLOWING_COUNT,
    SET_USER_GROUP_COUNT
} from '../Types';

const InitialState = {
    loggedUserInfo: {},
    isUserLoggedIn: false,
    userFollowingCount: 0,
    userFollowerCount: 0,
    userGroupCount: 0
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
        case SET_USER_FOLLOWING_COUNT:
            return {
                ...state,
                userFollowingCount: action.userFollowingCount
            }
        case SET_USER_FOLLOWER_COUNT:
            return {
                ...state,
                userFollowerCount: action.userFollowerCount
            }
        case SET_USER_GROUP_COUNT:
            return {
                ...state,
                userGroupCount: action.userGroupCount
            }
        default: return state;
    }
}

