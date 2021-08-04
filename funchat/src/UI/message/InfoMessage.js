import React from 'react';
import PropTypes from 'prop-types';
import { CancelIcon } from '../Icons';

const InfoMessage = (props) => {

    const { message, handleCloseInfomessage } = props;

    return (
        <div className="info_container">
            <div className="info_text">{message}</div>
            <CancelIcon cssClass={'info_cancle_icon'} handleEvent={() => handleCloseInfomessage()} />
        </div>
    )

};

InfoMessage.propTypes = {
    message: PropTypes.string.isRequired,
    handleCloseInfomessage: PropTypes.func.isRequired
}

export default InfoMessage;
