import React, { Fragment } from 'react';
import useForm from '../../hooks/useForm';
import useRoomAxios from '../../hooks/useRoomAxios';
import ErrorMessage from '../../UI/message/ErrorMessage';
import { validateForm } from '../../utils';
import { useSelector } from 'react-redux';

const HomeInfo = (props) => {

    const { history } = props;

    // hooks
    const { formData, handleFormData, formError, errorMessage, setFormError, setErrorMessage } = useForm();
    const { postAction } = useRoomAxios();

    // redux-state
    const { loggedUserInfo } = useSelector(state => state.userReducer);

    const joinPrivateGroup = async (e) => {
        e.preventDefault();
        const isFormValid = validateForm(['group'], formData, setFormError);
        if (isFormValid) {
            try {
                const { data, error } = await postAction(`/joinGroup?groupID=${formData.group}&groupType=private&userID=${loggedUserInfo._id}`);
                console.log(error);
                if (error) {
                    if (error.data.status === 'Failed') {
                        setErrorMessage(error.data.message);
                        throw new Error('Error while joining group');
                    }
                }
                if (data.status === 'Success' && data.data.groupID) {
                    history.push(`/group/${data.data.groupID}`);
                }
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    const handleCloseErrorMessage = () => {
        setFormError([]);
        setErrorMessage(null);
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
                formError.length > 0 && showErrorMessage(`Please Enter ${formError.join(', ')}`)
            }
            {
                errorMessage && showErrorMessage(errorMessage)
            }
            <div className="home_left_heading">
                <span className="highlight">FunChat</span> Create Private or Public groups and have fun with friends.
            </div>
            <div className="home_left_description">Join Private Group</div>
            <form onSubmit={(e) => joinPrivateGroup(e)}>
                <input
                    className="home_left_room_input"
                    placeholder="Group ID"
                    name="group"
                    value={formData?.group ?? ''}
                    onChange={handleFormData}
                />
                <button type="submit" className="home_left_room_join_btn">Join</button>
            </form>
        </Fragment>
    )

};

export default HomeInfo;
