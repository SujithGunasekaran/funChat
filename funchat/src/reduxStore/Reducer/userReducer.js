import {
    SET_USER_LOGGED_IN,
    SET_USER_INFO,
    SET_USER_FOLLOWER_COUNT,
    SET_USER_FOLLOWING_COUNT,
    SET_USER_GROUP_COUNT,
    SET_LOGGEDUSER_FOLLOWING_LIST,
    SET_VISITOR_FOLLOW_FOLLOWING_LIST,
} from '../Types';

const InitialState = {
    loggedUserInfo: {},
    isUserLoggedIn: false,
    loggedUserFollowingList: new Set(),
    userFollowingCount: 0,
    userFollowerCount: 0,
    userGroupCount: 0,
    visitorFollowFollowingList: [],
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
        case SET_LOGGEDUSER_FOLLOWING_LIST:
            return {
                ...state,
                loggedUserFollowingList: action.loggedUserFollowingList
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
        case SET_VISITOR_FOLLOW_FOLLOWING_LIST:
            return {
                ...state,
                visitorFollowFollowingList: action.visitorFollowFollowingList
            }
        default: return state;
    }
}

