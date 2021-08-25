import React, { Fragment, lazy, Suspense, useEffect } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { DeleteIcon, CallIcon } from '../../UI/Icons';
import { v4 as uuidv4 } from 'uuid';

const ChatForm = lazy(() => import('../../UI/form/chatForm'));
const MessageList = lazy(() => import('../../UI/card/Message/MessageList'));

let socket;

const MessageMiddle = (props) => {

    const { chatMessage, groupInfo, handleDeleteGroup, history } = props;


    useEffect(() => {
        socket = io('localhost:5000');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);

    const sendMessage = (message) => {
        try {
            socket.emit('sendMessage', { groupName: groupInfo.groupname, userId: loggedUserInfo._id, userName: loggedUserInfo.username, message }, (err) => {
                if (err) throw new Error('Error while sending the messages');
            });
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleGroupCall = () => {
        try {
            const callID = uuidv4();
            socket.emit('groupCall', ({ callID, groupName: groupInfo.groupname, userName: loggedUserInfo.username, userID: loggedUserInfo._id }), (err) => {
                if (err) throw new Error('Error while getting call');
            })
            history.push(`/group/${groupInfo.groupname}/call/${callID}`)
        }
        catch (err) {
            console.log(err);
        }
    }


    return (
        <Fragment>
            <div className="message_middle_header_container">
                <div className="message_middle_header_heading">{groupInfo && groupInfo.groupname}</div>
                <div className="message_middle_icon_container">
                    <CallIcon
                        cssClass="message_middle_call_icon"
                        handleEvent={handleGroupCall}
                    />
                    {
                        groupInfo &&
                        groupInfo.groupadmin === loggedUserInfo._id &&
                        <DeleteIcon
                            cssClass="message_middle_delete_icon"
                            handleEvent={handleDeleteGroup}
                        />
                    }
                </div>
            </div>
            <div className="message_middle_chat_container">
                {
                    chatMessage.length > 0 &&
                    <Suspense fallback={<div>Loading...</div>}>
                        <MessageList
                            chatList={chatMessage}
                        />
                    </Suspense>
                }
                <Suspense fallback={<div>Loading...</div>}>
                    <ChatForm
                        sendMessage={sendMessage}
                    />
                </Suspense>
            </div>
        </Fragment>
    )

};

MessageMiddle.defaultProps = {
    groupInfo: {}
}

MessageMiddle.propTypes = {
    groupInfo: PropTypes.object,
    chatMessage: PropTypes.array.isRequired
};

export default MessageMiddle;
