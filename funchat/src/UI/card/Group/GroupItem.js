import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { PeoplesIcon } from '../../Icons';
import useRoomAxios from '../../../hooks/useRoomAxios';
import { useSelector } from 'react-redux';
import { getCommaSeperatedName } from '../../../utils';

const GroupItem = (props) => {

    const { groupInfo, history } = props;

    // hooks
    const { postAction } = useRoomAxios();

    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);

    const joinRoom = async (roomID) => {
        try {
            const { data, error } = await postAction(`/joinRoom?roomID=${roomID}&userID=${loggedUserInfo._id}`);
            if (error) throw new Error('Error while joining the room');
            if (data.status === 'Success' && data.data.roomID) {
                history.push(`/group/${data.data.roomID}`)
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <Fragment>
            <div className="home_middle_room_card">
                <div className="home_middle_room_card_header">
                    <div className="home_middle_room_card_header_title">{groupInfo?.roomname ?? ''}</div>
                    <div className="home_middle_room_card_count">
                        <PeoplesIcon cssClass={'icon'} />
                        <div className="count">{Array.isArray(groupInfo.users) ? groupInfo.users.length : 0}</div>
                    </div>
                </div>
                <div className="home_middle_room_card_user">{getCommaSeperatedName(groupInfo.users, 'username')}</div>
            </div>
            <button className="home_middle_room_card_join_btn" onClick={() => joinRoom(groupInfo._id)}>Join</button>
        </Fragment>

    )

};

GroupItem.propTypes = {
    groupInfo: PropTypes.object.isRequired
}


export default GroupItem;
