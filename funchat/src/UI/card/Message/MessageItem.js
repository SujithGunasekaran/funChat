import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { fromNow } from '../../../utils';

const MessageItem = (props) => {

    const { chatInfo } = props;

    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);

    const time = fromNow(chatInfo.date);

    return (
        <Fragment>
            {
                chatInfo.type === 'Welcome' &&
                <div className="message_chat_welcome_message">{chatInfo.text}</div>
            }
            {
                chatInfo.type !== 'Welcome' ?
                    loggedUserInfo._id === chatInfo.userId ?
                        <Fragment>
                            <div className="message_middle_chat_logged_user_container">
                                <div className="message_middle_chat_logged_user_name">{chatInfo.user}</div>
                                <div className="message_middle_chat_logged_user_text">{chatInfo.text}</div>
                                <div className="message_middle_chat_time">{time}</div>
                            </div>
                        </Fragment>
                        :
                        <Fragment>
                            <div className="message_middle_chat_user_container">
                                <div className="message_middle_chat_user_name">{chatInfo.user}</div>
                                <div className="message_middle_chat_user_text">{chatInfo.text}</div>
                                <div className="message_middle_chat_time">{time}</div>
                            </div>
                        </Fragment>
                    : null
            }
        </Fragment>
    )

}

MessageItem.propTypes = {
    chatInfo: PropTypes.object.isRequired
}

export default MessageItem;
