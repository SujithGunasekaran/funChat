import React, { Fragment, useState } from 'react';
import useForm from '../../hooks/useForm';
import { validateForm } from '../../utils';
import ErrorMessage from '../message/ErrorMessage';

const CreateRoom = () => {

    // state
    const [showError, setShowError] = useState(false);

    // hooks
    const { formData, formError, handleFormData, setFormError } = useForm();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const isValidForm = validateForm(['username', 'roomname'], formData, setFormError);
        if (!isValidForm) {
            setShowError(true);
            return;
        }
    }

    const handleCloseErrorMessage = () => {
        setShowError(false);
        setFormError([]);
    }


    const errorMessage = (content) => (
        <ErrorMessage
            message={content}
            handleCloseErrorMessage={handleCloseErrorMessage}
        />
    )


    return (
        <Fragment>
            {
                showError &&
                errorMessage(`Please Enter ${formError.join(', ')}`)
            }
            <form onSubmit={handleFormSubmit}>
                <input
                    className="form_model_header_input"
                    placeholder="Username"
                    name="username"
                    value={formData?.username ?? ''}
                    onChange={handleFormData}
                />
                <input
                    className="form_model_header_input"
                    placeholder="Room Name"
                    name="roomname"
                    value={formData?.roomname ?? ''}
                    onChange={handleFormData}
                />
                <select className="form_model_header_input" onChange={handleFormData} name="roomtype">
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                </select>
                <button type="submit" className="form_model_header_create_btn">Create Room</button>
            </form>
        </Fragment>
    )

}

export default CreateRoom;
