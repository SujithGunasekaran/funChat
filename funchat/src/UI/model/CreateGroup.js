import React, { Fragment, useState } from 'react';
import useForm from '../../hooks/useForm';
import { validateForm } from '../../utils';
import { useSelector } from 'react-redux';
import ErrorMessage from '../message/ErrorMessage';
import useRoomAxios from '../../hooks/useRoomAxios';
import { withRouter } from 'react-router-dom';

const CreateGroup = (props) => {

    // state
    const [showError, setShowError] = useState(false);

    // hooks
    const { formData, formError, handleFormData, setFormError } = useForm();
    const { postAction, loading } = useRoomAxios();

    // selector
    const userReducer = useSelector(state => state.userReducer);
    const { loggedUserInfo } = userReducer;

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const isValidForm = validateForm(['username', 'groupname'], formData, setFormError);
        if (!isValidForm) {
            setShowError(true);
            return;
        }
        try {
            const requestData = {
                users: loggedUserInfo._id,
                groupname: formData.groupname,
                grouptype: formData?.grouptype ?? 'private'
            }
            const { data, error } = await postAction('/createGroup', requestData);
            if (error) throw new Error('Error while Creating Group');
            if (data.status === 'Success' && data.data.groupInfo) {
                props.history.push(`/group/${data.data.groupInfo._id}`)
            }
        }
        catch (err) {
            console.log(err);
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
                    placeholder="Group Name"
                    name="groupname"
                    value={formData?.groupname ?? ''}
                    onChange={handleFormData}
                />
                <select className="form_model_header_input" onChange={handleFormData} name="grouptype">
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                </select>
                <button type="submit" className="form_model_header_create_btn">Create Room</button>
            </form>
        </Fragment>
    )

}


export default withRouter(CreateGroup);
