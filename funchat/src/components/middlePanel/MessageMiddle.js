import React, { Fragment, lazy, Suspense, useEffect } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';
import { DeleteIcon } from '../../UI/Icons';

const ChatForm = lazy(() => import('../../UI/form/chatForm'));
const MessageList = lazy(() => import('../../UI/card/Message/MessageList'));

let socket;

const MessageMiddle = (props) => {

    const { chatMessage, groupInfo, handleDeleteGroup } = props;


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


    return (
        <Fragment>
            <div className="message_middle_header_container">
                <div className="message_middle_header_heading">{groupInfo && groupInfo.groupname}</div>
                <div className="message_middle_icon_container">
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

MessageMiddle.propTypes = {
    groupInfo: PropTypes.object,
    chatMessage: PropTypes.array.isRequired
};

export default MessageMiddle;
