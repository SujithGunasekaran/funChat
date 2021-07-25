import React, { Fragment, memo } from 'react';
import { useSelector } from 'react-redux';

const UserProfile = () => {

    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);

    return (
        <Fragment>
            <div className="user_right_profile_header">
                <img src={loggedUserInfo.profile} className="profile" loading={'lazy'} alt={loggedUserInfo.username} />
                <div className="user_name">{loggedUserInfo.username}</div>
            </div>
        </Fragment>
    )

};


export default memo(UserProfile);
