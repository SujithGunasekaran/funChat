import React, { Fragment, Suspense, lazy } from 'react';
import { CancelIcon } from '../Icons';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const ChatForm = lazy(() => import('../form/chatForm'));
const MessageList = lazy(() => import('../card/Message/MessageList'));

let socket = io('localhost:5000');

const UserChatPanel = (props) => {

    // props
    const { groupName, callID, handleView, messageList } = props;

    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);

    const sendMessage = (messageInput) => {
        socket.emit('sendGroupCallMessage', { callID, userId: loggedUserInfo._id, userName: loggedUserInfo.username, message: messageInput });
    }

    return (
        <Fragment>
            <div className="group_call_chat_list_header">
                <div className="group_call_chat_list_header_name">{groupName}</div>
                <CancelIcon
                    cssClass="group_call_chat_list_header_close_icon"
                    handleEvent={handleView}
                    input={false}
                />
            </div>
            <div className="group_call_middle_chat_container">
                {
                    messageList.length > 0 &&
                    <Suspense fallback={<div>Loading...</div>}>
                        <MessageList
                            chatList={messageList}
                        />
                    </Suspense>
                }
                <Suspense fallback={<div>Loading...</div>}>
                    <ChatForm
                        cssClass="group_call_middle_input_container"
                        sendMessage={sendMessage}
                    />
                </Suspense>
            </div>
        </Fragment>
    )

}

export default UserChatPanel;
