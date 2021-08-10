import React, { Fragment } from 'react';
import { PeoplesIcon } from '../Icons';
import useRoomAxios from '../../hooks/useRoomAxios';
import { useSelector } from 'react-redux';

const GroupItem = (props) => {

    // props
    const { history, groupInfo } = props;

    // hooks
    const { postAction, loading } = useRoomAxios();

    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);

    const joinRoom = async (groupID) => {
        try {
            const { data, error } = await postAction(`/joinGroup?groupID=${groupID}&userID=${loggedUserInfo._id}`);
            if (error && error.type !== 'Authentication') throw new Error('Error while joining the room');
            if (error && error.type === 'Authentication') {
                history.push('/');
                return;
            }
            if (data.status === 'Success' && data.data.groupID) {
                history.push(`/group/${data.data.groupID}`)
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <Fragment>
            <div className="home-right_user_group_header">
                <div className="home_right_user_group_name" onClick={() => joinRoom(groupInfo._id)}>{loading ? 'Joining...' : groupInfo.groupname}</div>
                <div className="home_right_user_group_count">
                    <PeoplesIcon cssClass={'icon'} />
                    <span className="count">
                        {groupInfo.users.length}
                    </span>
                </div>
            </div>
        </Fragment>
    )

};

export default GroupItem;
