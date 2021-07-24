import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';

const MessageMiddle = (props) => {

    const { welcomeMessage } = props;

    console.log(welcomeMessage)

    return (
        <Fragment>
            <div className="message_middle_chat_container">
                <div className="message_chat_welcome_message">{welcomeMessage.text}</div>
            </div>
        </Fragment>
    )

};

MessageMiddle.propTypes = {
    welcomeMessage: PropTypes.object.isRequired
};

export default memo(MessageMiddle);
