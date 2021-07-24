import React, { Fragment } from 'react';

const RoomUser = (props) => {

    const { userList } = props;

    return (
        <Fragment>
            <div className="message_right_user_container">
                {
                    userList.map((userInfo, index) => (
                        <Fragment key={index}>
                            <div className="message_right_userinfo_container">
                                <img src={userInfo.profile} className="profile" loading={'lazy'} alt={userInfo.username} />
                                <div className="user_name">{userInfo?.username ?? ''}</div>
                            </div>
                        </Fragment>
                    ))
                }
            </div>
        </Fragment>
    )

};


export default RoomUser;
