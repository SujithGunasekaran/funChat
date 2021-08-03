import { batch } from 'react-redux';

/**
 * Function used to follow and unfollow user 
 * @param {visitorId, loggedUserInfoId, followerId, visitorPageType, type} inputObj 
 * @param {API call function} callback 
 * @param {redux dispatch} dispatch 
 */

export const followUnfollowApi = async (inputObj, callback, dispatch) => {
    const { visitorId, loggedUserInfoId, followerId, visitorPageType, type } = inputObj;
    try {
        const { data, error } = await callback(`/followFollowing?visitorUserId=${visitorId}&loggedUserId=${loggedUserInfoId}&followerId=${followerId}&type=${type}&visitorPageType=${visitorPageType}`)
        if (error) throw new Error(error.message);
        if (data && data.status === 'Success') {
            batch(() => {
                dispatch({
                    type: 'SET_USER_FOLLOWER_COUNT',
                    userFollowerCount: data.data.userFollowerCount,
                })
                dispatch({
                    type: 'SET_USER_FOLLOWING_COUNT',
                    userFollowingCount: data.data.userFollowingCount,
                })
                dispatch({
                    type: 'SET_LOGGEDUSER_FOLLOWING_LIST',
                    loggedUserFollowingList: new Set(data.data.loggedUserFollowingList)
                });
                dispatch({
                    type: 'SET_VISITOR_FOLLOW_FOLLOWING_LIST',
                    visitorFollowFollowingList: data.data.userList
                })
            })
        }
    }
    catch (err) {
        console.log(err);
    }

}
