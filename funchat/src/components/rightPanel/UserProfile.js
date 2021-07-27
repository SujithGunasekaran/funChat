import React, { Fragment, memo } from 'react';
import { useSelector } from 'react-redux';
import { convertFullDateToLong } from '../../utils';

const UserProfile = (props) => {

    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);

    // props
    const { showLeaveButton = false, leaveButtonAction } = props;

    const joniedDate = convertFullDateToLong(new Date(`${loggedUserInfo?.joined ?? ''}`));

    return (
        <Fragment>
            <div className="user_right_profile_header">
                <img src={loggedUserInfo.profile} className="profile" loading={'lazy'} alt={loggedUserInfo.username} />
                <div className="user_name">{loggedUserInfo?.username ?? ''}</div>
            </div>
            <div className="user_right_profile_body">
                <div className="user_right_profile_description">{loggedUserInfo?.description ?? ''}</div>
                <button className="user_right_profile_follow_btn">Follow</button>
                {
                    showLeaveButton &&
                    <Fragment>
                        <button onClick={() => leaveButtonAction({ userId: loggedUserInfo._id, userName: loggedUserInfo.username })} className="user_right_leave_group_btn">Leave Group</button>
                    </Fragment>
                }
                <div className="user_right_profile_info_container">
                    <div className="user_right_profile_info_heading">Joined</div>
                    <div className="user_right_profile_info_text">{joniedDate}</div>
                </div>
            </div>
        </Fragment>
    )

};


export default memo(UserProfile);
