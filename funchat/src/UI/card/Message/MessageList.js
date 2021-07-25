import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MessageItem from './MessageItem';

const MessageList = (props) => {

    const { chatList } = props;

    return (
        <Fragment>
            {
                chatList.map((chatInfo, index) => (
                    <Fragment key={index}>
                        <MessageItem
                            chatInfo={chatInfo}
                        />
                    </Fragment>
                ))
            }
        </Fragment>
    )

}

MessageList.propTypes = {
    chatList: PropTypes.array.isRequired
}

export default MessageList;
