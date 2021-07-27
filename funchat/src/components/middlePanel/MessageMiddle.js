import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import ChatForm from '../../UI/form/chatForm';
import MessageList from '../../UI/card/Message/MessageList';

const MessageMiddle = (props) => {

    const { sendMessage, chatMessage } = props;

    return (
        <Fragment>
            <div className="message_middle_chat_container">
                {
                    chatMessage.length > 0 &&
                    <MessageList
                        chatList={chatMessage}
                    />
                }
                <ChatForm
                    sendMessage={sendMessage}
                />
            </div>
        </Fragment>
    )

};

MessageMiddle.propTypes = {
    welcomeMessage: PropTypes.object.isRequired
};

export default MessageMiddle;
