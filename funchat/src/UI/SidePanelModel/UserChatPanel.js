import React, { Fragment, Suspense, lazy, useEffect } from 'react';
import { CancelIcon } from '../Icons';
import io from 'socket.io-client';
import { useSelector } from 'react-redux';

const ChatForm = lazy(() => import('../form/chatForm'));

let socket = io('localhost:5000');

const UserChatPanel = (props) => {

    // props
    const { groupName, callID, handleView, } = props;


    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);

    useEffect(() => {
        initialize();
    }, [])

    const initialize = () => {
        socket.on('receiveGroupCallMessage', message => {
            console.log("message", message);
        })
    }

    const sendMessage = (messageInput) => {

        try {
            socket.emit('sendGroupCallMessage', { callID, userId: loggedUserInfo._id, userName: loggedUserInfo.username, message: messageInput }, (err) => {
                if (err) throw new Error('Error while sending message');
            })
        }
        catch (err) {
            console.log(err);
        }
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
                <Suspense fallback={<div>Loading...</div>}>
                    <ChatForm
                        sendMessage={sendMessage}
                    />
                </Suspense>
            </div>
        </Fragment>
    )

}

export default UserChatPanel;
