import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import UserItem from './UserItem';

const UserList = (props) => {

    // props
    const { userData, visitorId, visitorPageType } = props

    return (
        <Fragment>
            {
                userData.map((userInfo, index) => (
                    <Fragment key={index}>
                        <div className="user_profile_list_container">
                            <UserItem
                                userInfo={userInfo}
                                visitorId={visitorId}
                                visitorPageType={visitorPageType}
                            />
                        </div>
                        {
                            index < (userInfo.length - 1) &&
                            <hr className="user_profile_list_hr" />
                        }
                    </Fragment>
                ))
            }
        </Fragment>
    )

};

UserList.propTypes = {
    userData: PropTypes.array.isRequired,
    visitorId: PropTypes.string.isRequired,
    visitorPageType: PropTypes.string.isRequired
}

export default UserList;
