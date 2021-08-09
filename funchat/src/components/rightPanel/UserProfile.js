import React, { Fragment, memo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { convertFullDateToLong } from '../../utils';
import useRoomAxios from '../../hooks/useRoomAxios';
import io from 'socket.io-client';

let socket;

const UserProfile = (props) => {

    // redux-state
    const { loggedUserInfo, loggedUserFollowingList, loggedUserFollowerList } = useSelector(state => state.userReducer);

    // props
    const { showLeaveButton = false, socketNeeded = false, groupInfo, history = {} } = props;

    // hooks
    const { postAction } = useRoomAxios();

    // useEffect
    useEffect(() => {
        if (socketNeeded) socket = io('localhost:5000');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const joniedDate = convertFullDateToLong(new Date(`${loggedUserInfo?.joined ?? ''}`));

    const leaveGroup = async ({ userId, userName }) => {
        try {
            const { data, error } = await postAction(`/leaveGroup/?userID=${userId}&groupID=${groupInfo._id}`);
            if (error && error.type !== 'Authentication') throw new Error('Error while leaving the group');
            if (error && error.type === 'Authentication') {
                history.push('/');
                return;
            }
            if (data.status === 'Success') {
                socket.emit('leaveGroup', { groupName: groupInfo.groupname, userName }, (err) => {
                    if (err) throw new Error('Error while leaving the group');
                    history.push('/home');
                })
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <Fragment>
            <div className="user_right_profile_header">
                <img src={loggedUserInfo.profile} className="profile" loading={'lazy'} alt={loggedUserInfo.username} />
                <div className="user_name">{loggedUserInfo?.username ?? ''}</div>
            </div>
            <div className="user_right_profile_body">
                <div className="user_right_profile_description">{loggedUserInfo?.description ?? ''}</div>
                <div className="user_right_profile_follow_container">
                    <div className="user_right_profile_item">
                        <div className="user_right_profile_follow_count">{loggedUserFollowerList.size}</div>
                        <div className="user_right_profile_follow_name">Followers</div>
                    </div>
                    <div className="user_right_profile_item">
                        <div className="user_right_profile_follow_count">{loggedUserFollowingList.size}</div>
                        <div className="user_right_profile_follow_name">Following</div>
                    </div>
                </div>
                <button className="user_right_profile_follow_btn">Follow</button>
                {
                    showLeaveButton &&
                    <Fragment>
                        <button onClick={() => leaveGroup({ userId: loggedUserInfo._id, userName: loggedUserInfo.username })} className="user_right_leave_group_btn">Leave Group</button>
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
