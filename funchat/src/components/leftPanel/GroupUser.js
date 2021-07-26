import React, { Fragment, memo } from 'react';

const RoomUser = (props) => {

    const { userList, groupInfo } = props;

    return (
        <Fragment>
            <div className="message_left_user_container">
                {
                    userList.map((userInfo, index) => (
                        <Fragment key={index}>
                            <div className="message_left_userinfo_container">
                                <img src={userInfo.profile} className="profile" loading={'lazy'} alt={userInfo.username} />
                                <div className="message_left_userinfo_user_container">
                                    <div className="user_name">{userInfo?.username ?? ''}</div>
                                    {
                                        groupInfo &&
                                        groupInfo.groupadmin === userInfo._id &&
                                        <div className="admin_text">Admin</div>
                                    }
                                </div>
                            </div>
                            {
                                index < (userList.length - 1) &&
                                <hr className="message_left_user_hr" />
                            }
                        </Fragment>
                    ))
                }
            </div>
        </Fragment>
    )

};


export default memo(RoomUser);
