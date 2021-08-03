import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import useFollowFollowingAxios from '../../../hooks/useFollowFollowingAxios';
import { followUnfollowApi } from '../../../utils/APIUtil';
import PageLink from '../../PageLink';

const UserItem = (props) => {

    // props
    const { userInfo, visitorId, visitorPageType } = props;

    // hooks
    const { postAction } = useFollowFollowingAxios();

    // redux-state
    const { loggedUserFollowingList, loggedUserInfo } = useSelector(state => state.userReducer);

    // dispatch
    const dispatch = useDispatch();

    const followUnfollowUser = async (followerId, type) => {
        const inputObject = {
            visitorId,
            loggedUserInfoId: loggedUserInfo._id,
            followerId,
            visitorPageType,
            type
        }
        try {
            await followUnfollowApi(inputObject, postAction, dispatch);
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <Fragment>
            <div className="user_profile_list_header">
                <img src={userInfo.profile} alt={userInfo.username} className="user_profile_list_image" loading="lazy" />
                <PageLink pathname={`/user/${userInfo._id}`}>
                    <div className="user_profile_list_name">{userInfo.username}</div>
                </PageLink>
                {
                    loggedUserInfo._id !== userInfo._id ?
                        loggedUserFollowingList.has(userInfo._id) ?
                            <button className="user_profile_list_btn" onClick={() => followUnfollowUser(userInfo._id, 'unfollow')}>UnFollow</button> :
                            <button className="user_profile_list_btn" onClick={() => followUnfollowUser(userInfo._id, 'follow')}>Follow</button>
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
