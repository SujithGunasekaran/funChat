import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import useFollowFollowingAxios from '../../../hooks/useFollowFollowingAxios';

const UserItem = (props) => {

    // props
    const { userInfo, visitorId, visitorPageType } = props;

    // hooks
    const { postAction } = useFollowFollowingAxios();

    // redux-state
    const { loggedUserFollowingList, loggedUserInfo } = useSelector(state => state.userReducer);

    // dispatch
    const dispatch = useDispatch();

    const followUser = async (followerId) => {
        try {
            const { data, error } = await postAction(`/followFollowing?visitorUserId=${visitorId}&loggedUserId=${loggedUserInfo._id}&followerId=${followerId}&type=follow&visitorPageType=${visitorPageType}`)
            if (error) throw new Error(error.message);
            if (data && data.status === 'Success') {
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
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const unFollowUser = async (followerId) => {
        try {
            const { data, error } = await postAction(`/followFollowing?visitorUserId=${visitorId}&loggedUserId=${loggedUserInfo._id}&followerId=${followerId}&type=unfollow&visitorPageType=${visitorPageType}`)
            if (error) throw new Error(error.message);
            if (data && data.status === 'Success') {
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
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <Fragment>
            <div className="user_profile_list_header">
                <img src={userInfo.profile} alt={userInfo.username} className="user_profile_list_image" loading="lazy" />
                <div className="user_profile_list_name">{userInfo.username}</div>
                {
                    loggedUserInfo._id !== userInfo._id ?
                        loggedUserFollowingList.has(userInfo._id) ?
                            <button className="user_profile_list_btn" onClick={() => unFollowUser(userInfo._id)}>UnFollow</button> :
                            <button className="user_profile_list_btn" onClick={() => followUser(userInfo._id)}>Follow</button>
                        : null
                }

            </div>
        </Fragment>
    )

};

UserItem.propTypes = {
    userInfo: PropTypes.object.isRequired,
    visitorId: PropTypes.string.isRequired,
    visitorPageType: PropTypes.string.isRequired
}

export default UserItem;
