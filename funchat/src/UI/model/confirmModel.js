import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ConfirmModel = (props) => {

    const { title, cancelAction, successAction, confirmBtnText } = props;

    return (
        <Fragment>
            <div className="model_container">
                <div className="model_heading">{title}</div>
                <div className="model_btn_container">
                    <button className="model_btn_cancel" onClick={() => cancelAction()}>Cancel</button>
                    <button className="model_btn_success" onClick={() => successAction()}>{confirmBtnText}</button>
                </div>
            </div>
        </Fragment>
    )

}

ConfirmModel.propTypes = {
    title: PropTypes.string.isRequired,
    cancelAction: PropTypes.func.isRequired,
    successAction: PropTypes.func.isRequired,
    confirmBtnText: PropTypes.string.isRequired
}

export default ConfirmModel;
