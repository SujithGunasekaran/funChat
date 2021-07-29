import React, { Fragment, lazy, Suspense } from 'react';
import PropTypes from 'prop-types';

const ChatForm = lazy(() => import('../../UI/form/chatForm'));
const MessageList = lazy(() => import('../../UI/card/Message/MessageList'));


const MessageMiddle = (props) => {

    const { sendMessage, chatMessage } = props;

    return (
        <Fragment>
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
    sendMessage: PropTypes.func.isRequired,
    chatMessage: PropTypes.array.isRequired
};

export default MessageMiddle;
