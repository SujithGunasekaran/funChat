import React, { Fragment } from 'react';
import PropTypes from 'prop-types';


const UserItem = (props) => {

    // props
    const { userInfo } = props;

    return (
        <Fragment>
            <div className="user_profile_list_header">
                <img src={userInfo.profile} alt={userInfo.username} className="user_profile_list_image" loading="lazy" />
                <div className="user_profile_list_name">{userInfo.username}</div>
                <button className="user_profile_list_btn">Follow</button>
            </div>
        </Fragment>
    )

};

UserItem.propTypes = {
    userInfo: PropTypes.object.isRequired,
}

export default UserItem;
