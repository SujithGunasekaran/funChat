import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const MessageItem = (props) => {

    const { chatInfo } = props;

    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);

    return (
        <Fragment>
            {
                loggedUserInfo._id === chatInfo.userId ?
                    <Fragment>
                        <div className="message_middle_chat_logged_user_container">
                            <div className="message_middle_chat_logged_user_name">{chatInfo.user}</div>
                            <div className="message_middle_chat_logged_user_text">{chatInfo.text}</div>
                        </div>
                    </Fragment>
                    :
                    <Fragment>
                        <div className="message_middle_chat_user_container">
                            <div className="message_middle_chat_user_name">{chatInfo.user}</div>
                            <div className="message_middle_chat_user_text">{chatInfo.text}</div>
                        </div>
                    </Fragment>
            }
        </Fragment>
    )

}

MessageItem.propTypes = {
    chatInfo: PropTypes.object.isRequired
}

export default MessageItem;
