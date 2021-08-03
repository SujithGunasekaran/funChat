import React, { Fragment, useEffect } from 'react';
import useForm from '../../hooks/useForm';
import { validateForm } from '../../utils';
import { useSelector } from 'react-redux';
import ErrorMessage from '../message/ErrorMessage';
import useUserAxios from '../../hooks/useUserAxios';
import { useDispatch } from 'react-redux';

const ProfileEdit = () => {

    // hooks
    const { formData, formError, errorMessage, handleFormData, setFormError, setErrorMessage, setInitialValue } = useForm();
    const { updateAction, loading } = useUserAxios();

    // selector
    const userReducer = useSelector(state => state.userReducer);
    const { loggedUserInfo } = userReducer;

    // dispatch
    const dispatch = useDispatch();

    useEffect(() => {
        setInitialValue({
            username: loggedUserInfo.username,
            description: loggedUserInfo.description
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const isValidForm = validateForm(['username', 'description'], formData, setFormError);
        if (!isValidForm) {
            return;
        }
        try {
            const requestData = {
                username: formData.username,
                description: formData.description
            };
            const { data, error } = await updateAction(`/updateProfile?userID=${loggedUserInfo._id}`, requestData);
            if (error) {
                if (error.data.status === 'Failed') {
                    setErrorMessage(error.data.message);
                }
                throw new Error(error.data);
            }
            if (data && data.status === 'Success' && data.data.userInfo) {
                dispatch({
                    type: 'SET_USER_INFO',
                    userInfo: data.data.userInfo
                })
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const handleCloseErrorMessage = () => {
        setErrorMessage(null);
        setFormError([]);
    }


    const showErrorMessage = (content) => (
        <ErrorMessage
            message={content}
            handleCloseErrorMessage={handleCloseErrorMessage}
        />
    )

    return (
        <Fragment>
            {
                formError.length > 0 &&
                showErrorMessage(`Please Enter ${formError.join(', ')}`)
            }
            {
                errorMessage &&
                showErrorMessage(errorMessage)
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
                    placeholder="Description"
                    name="description"
                    value={formData?.description ?? ''}
                    onChange={handleFormData}
                />
                <button disabled={loading} type="submit" className="form_model_header_create_btn">{loading ? 'Editing...' : 'Edit'}</button>
            </form>
        </Fragment>
    )

}


export default ProfileEdit;
