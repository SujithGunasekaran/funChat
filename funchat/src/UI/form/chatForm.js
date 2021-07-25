import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import useForm from '../../hooks/useForm';
import { validateForm } from '../../utils';
import SendIcon from '@material-ui/icons/Send';

const ChatForm = (props) => {

    const { sendMessage } = props;

    const { formData, handleFormData, resetForm, setFormError } = useForm();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const isFormValid = validateForm(['chat'], formData, setFormError);
        if (isFormValid) {
            sendMessage(formData.chat);
            resetForm();
        }
    }

    return (
        <Fragment>
            <form onSubmit={(e) => handleFormSubmit(e)}>
                <div className="message_chat_input_container">
                    <div className="container_fluid" style={{ width: '100%' }}>
                        <div className="row">
                            <div className="col-10 col-sm-10 col-md-11">
                                <input
                                    type="text"
                                    name="chat"
                                    className="message_chat_input"
                                    placeholder={'Type Something...'}
                                    onChange={handleFormData}
                                    value={formData?.chat ?? ''}
                                />
                            </div>
                            <div className="col-2 col-sm-2 col-md-1">
                                <button className="message_send_btn">
                                    <SendIcon className="icon" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Fragment>
    )

};


ChatForm.propTypes = {
    sendMessage: PropTypes.func.isRequired
};

export default ChatForm;
