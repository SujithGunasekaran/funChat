import React, { Fragment, memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DotIcon } from '../../UI/Icons';
import useRoomAxios from '../../hooks/useRoomAxios';
import { unstable_batchedUpdates } from 'react-dom';


const GroupUser = (props) => {

    // state
    const [userList, setUserList] = useState([]);
    const [offlineUser, setOfflineUsers] = useState(new Set());

    // props
    const { welcomeMessage, groupID, groupInfo, history = {} } = props;

    // hooks
    const { getAction } = useRoomAxios()

    useEffect(() => {
        getRoomUserList();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [welcomeMessage])


    const getRoomUserList = async () => {
        try {
            const { data, error } = await getAction(`/getGroupUser?groupID=${groupID}`, false);
            if (error && error.type !== 'Authentication') {
                throw new Error('Error while getting user list');
            }
            if (error && error.type === 'Authentication') {
                history.push('/');
                return;
            }
            if (data && data.status === 'Success') {
                unstable_batchedUpdates(() => {
                    setOfflineUsers(new Set([...data.data.offlineUser]))
                    setUserList(prevUserList => {
                        let userList = prevUserList.slice();
                        userList = data.data.userList;
                        return userList;
                    })
                })
            }
        }
        catch (err) {
            console.log(err);
        }
    }


    return (
        <Fragment>
            <div className="message_left_user_container">
                {
                    userList.length > 0 &&
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
                                <DotIcon
                                    cssClass={`message_left_userInfo_dot_icon ${offlineUser.has(userInfo._id) ? 'offline' : 'online'}`}
                                />
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



GroupUser.propTypes = {
    groupInfo: PropTypes.object,
    welcomeMessage: PropTypes.object.isRequired,
    groupID: PropTypes.string.isRequired,
    history: PropTypes.object
}


export default memo(GroupUser);
