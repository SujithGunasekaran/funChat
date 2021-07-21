import React from 'react';
import PropTypes from 'prop-types';
import { CancelIcon } from '../Icons';

const ErrorMessage = (props) => {

    const { message, handleCloseErrorMessage } = props;

    return (
        <div className="failure_container">
            <div className="failure_text">{message}</div>
            <CancelIcon cssClass={'failure_cancle_icon'} handleEvent={() => handleCloseErrorMessage()} />
        </div>
    )

};

ErrorMessage.propTypes = {
    message: PropTypes.string.isRequired,
    handleCloseErrorMessage: PropTypes.func.isRequired
}

export default ErrorMessage;
