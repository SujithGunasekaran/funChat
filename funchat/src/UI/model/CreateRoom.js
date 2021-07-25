import React, { Fragment, useState } from 'react';
import useForm from '../../hooks/useForm';
import { validateForm } from '../../utils';
import { useSelector, useDispatch } from 'react-redux';
import ErrorMessage from '../message/ErrorMessage';
import useRoomAxios from '../../hooks/useRoomAxios';
import { withRouter } from 'react-router-dom';

const CreateRoom = (props) => {

    // state
    const [showError, setShowError] = useState(false);

    // hooks
    const { formData, formError, handleFormData, setFormError } = useForm();
    const { postAction, loading } = useRoomAxios();

    // dispatch
    const dispatch = useDispatch();

    // selector
    const userReducer = useSelector(state => state.userReducer);
    const { loggedUserInfo } = userReducer;

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const isValidForm = validateForm(['username', 'roomname'], formData, setFormError);
        if (!isValidForm) {
            setShowError(true);
            return;
        }
        try {
            const requestData = {
                users: loggedUserInfo._id,
                roomname: formData.roomname,
                roomtype: formData?.roomtype ?? 'private'
            }
            const { data, error } = await postAction('/createRoom', requestData);
            if (error) throw new Error('Error while Creating room');
            if (data.status === 'Success' && data.data.roomInfo) {
                dispatch({
                    type: 'SET_ROOM_INFO',
                    roomInfo: {
                        [data.data.roomInfo._id]: data.data.roomInfo
                    }
                })
                props.history.push(`/room/${data.data.roomInfo._id}`)
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


export default withRouter(CreateRoom);
